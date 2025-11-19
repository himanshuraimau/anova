import jsPDF from 'jspdf'

interface PDFOptions {
  title?: string
  backgroundColor?: string
  textColor?: string
  primaryColor?: string
  accentColor?: string
}

export class PDFGenerator {
  private static convertMarkdownToText(markdownContent: string): string {
    let text = markdownContent

    // Remove markdown headers but keep the text
    text = text.replace(/^#+\s+(.*)$/gm, '$1')

    // Remove markdown bold/italic but keep text
    text = text.replace(/\*\*(.*?)\*\*/g, '$1')
    text = text.replace(/\*(.*?)\*/g, '$1')

    // Remove markdown links but keep text
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')

    // Remove markdown code inline but keep text
    text = text.replace(/`([^`]+)`/g, '$1')

    // Keep mermaid code blocks as-is (they start with ```mermaid)
    // Just ensure they're formatted nicely

    // Remove markdown list markers but keep indentation
    text = text.replace(/^[\*\-\+]\s+/gm, '  • ')
    text = text.replace(/^\d+\.\s+/gm, (match, offset) => {
      const num = parseInt(match)
      return `  ${num}. `
    })

    // Clean up extra blank lines (max 2 consecutive)
    text = text.replace(/\n{3,}/g, '\n\n')

    // Remove markdown table formatting but keep content
    text = text.replace(/\|/g, ' | ')
    text = text.replace(/^\|[\s\-:]+\|$/gm, '') // Remove separator rows

    return text.trim()
  }

  static async generatePDF(
    content: string,
    options: PDFOptions = {}
  ): Promise<void> {
    const {
      title = 'ANOVA Study Notes',
      backgroundColor = '#fffbeb',
      textColor = '#292524',
      primaryColor = '#991b1b',
      accentColor = '#f59e0b',
    } = options

    // Convert markdown to plain text
    const textContent = this.convertMarkdownToText(content)

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const margin = 20 // 20mm margin on all sides
    const contentWidth = pdfWidth - (margin * 2)
    const headerHeight = 25

    // Add header with title
    pdf.setFillColor(parseInt(primaryColor.slice(1, 3), 16), parseInt(primaryColor.slice(3, 5), 16), parseInt(primaryColor.slice(5, 7), 16))
    pdf.rect(0, 0, pdfWidth, headerHeight, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text(title, margin, headerHeight - 8)

    // Add decorative line
    pdf.setDrawColor(parseInt(accentColor.slice(1, 3), 16), parseInt(accentColor.slice(3, 5), 16), parseInt(accentColor.slice(5, 7), 16))
    pdf.setLineWidth(0.5)
    pdf.line(margin, headerHeight, pdfWidth - margin, headerHeight)

    // Set text color and font for content
    pdf.setTextColor(parseInt(textColor.slice(1, 3), 16), parseInt(textColor.slice(3, 5), 16), parseInt(textColor.slice(5, 7), 16))
    pdf.setFontSize(11)
    pdf.setFont('times', 'normal')

    // Split content into lines
    const lines = textContent.split('\n')
    let yPosition = headerHeight + 10
    const lineHeight = 6
    const pageHeight = pdfHeight - margin

    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Check if we need a new page
      if (yPosition + lineHeight > pageHeight) {
        // Add page number
        pdf.setTextColor(150, 150, 150)
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`Page ${pdf.internal.pages.length}`, pdfWidth - margin - 10, pdfHeight - 5)
        
        pdf.addPage()
        yPosition = margin
        pdf.setTextColor(parseInt(textColor.slice(1, 3), 16), parseInt(textColor.slice(3, 5), 16), parseInt(textColor.slice(5, 7), 16))
        pdf.setFontSize(11)
        pdf.setFont('times', 'normal')
      }

      // Handle empty lines
      if (line === '') {
        yPosition += lineHeight * 0.5
        continue
      }

      // Check if this is a mermaid code block
      if (line.startsWith('```mermaid')) {
        // Set font for code
        pdf.setFont('courier', 'normal')
        pdf.setFontSize(10)
        pdf.setTextColor(parseInt(primaryColor.slice(1, 3), 16), parseInt(primaryColor.slice(3, 5), 16), parseInt(primaryColor.slice(5, 7), 16))
        
        yPosition += lineHeight
        pdf.text('Mermaid Diagram:', margin, yPosition)
        yPosition += lineHeight * 1.5

        // Collect mermaid code lines
        let mermaidCode = ''
        i++ // Skip the ```mermaid line
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          mermaidCode += lines[i] + '\n'
          i++
        }

        // Split mermaid code into multiple lines if needed
        const mermaidLines = pdf.splitTextToSize(mermaidCode, contentWidth)
        for (const mermaidLine of mermaidLines) {
          if (yPosition + lineHeight > pageHeight) {
            pdf.setTextColor(150, 150, 150)
            pdf.setFontSize(9)
            pdf.setFont('helvetica', 'normal')
            pdf.text(`Page ${pdf.internal.pages.length}`, pdfWidth - margin - 10, pdfHeight - 5)
            
            pdf.addPage()
            yPosition = margin
            pdf.setFont('courier', 'normal')
            pdf.setFontSize(10)
            pdf.setTextColor(parseInt(primaryColor.slice(1, 3), 16), parseInt(primaryColor.slice(3, 5), 16), parseInt(primaryColor.slice(5, 7), 16))
          }
          pdf.text(mermaidLine, margin + 5, yPosition)
          yPosition += lineHeight
        }

        yPosition += lineHeight * 0.5
        pdf.setFont('times', 'normal')
        pdf.setFontSize(11)
        pdf.setTextColor(parseInt(textColor.slice(1, 3), 16), parseInt(textColor.slice(3, 5), 16), parseInt(textColor.slice(5, 7), 16))
        continue
      }

      // Check if this is a regular code block
      if (line.startsWith('```')) {
        pdf.setFont('courier', 'normal')
        pdf.setFontSize(10)
        pdf.setTextColor(parseInt(primaryColor.slice(1, 3), 16), parseInt(primaryColor.slice(3, 5), 16), parseInt(primaryColor.slice(5, 7), 16))
        
        i++ // Skip the ``` line
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          const codeLine = lines[i]
          const codeLines = pdf.splitTextToSize(codeLine, contentWidth - 10)
          for (const codeLinePart of codeLines) {
            if (yPosition + lineHeight > pageHeight) {
              pdf.setTextColor(150, 150, 150)
              pdf.setFontSize(9)
              pdf.setFont('helvetica', 'normal')
              pdf.text(`Page ${pdf.internal.pages.length}`, pdfWidth - margin - 10, pdfHeight - 5)
              
              pdf.addPage()
              yPosition = margin
              pdf.setFont('courier', 'normal')
              pdf.setFontSize(10)
              pdf.setTextColor(parseInt(primaryColor.slice(1, 3), 16), parseInt(primaryColor.slice(3, 5), 16), parseInt(primaryColor.slice(5, 7), 16))
            }
            pdf.text(codeLinePart, margin + 5, yPosition)
            yPosition += lineHeight
          }
          i++
        }
        yPosition += lineHeight * 0.5
        pdf.setFont('times', 'normal')
        pdf.setFontSize(11)
        pdf.setTextColor(parseInt(textColor.slice(1, 3), 16), parseInt(textColor.slice(3, 5), 16), parseInt(textColor.slice(5, 7), 16))
        continue
      }

      // Check if this is a heading (all caps or starts with number)
      const isHeading = /^[A-Z][A-Z\s]+$/.test(line) || /^\d+\./.test(line) || line.length < 60 && line.split(' ').length < 8
      
      if (isHeading && line.length > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(13)
        pdf.setTextColor(parseInt(primaryColor.slice(1, 3), 16), parseInt(primaryColor.slice(3, 5), 16), parseInt(primaryColor.slice(5, 7), 16))
        yPosition += lineHeight * 0.5
      } else {
        pdf.setFont('times', 'normal')
        pdf.setFontSize(11)
        pdf.setTextColor(parseInt(textColor.slice(1, 3), 16), parseInt(textColor.slice(3, 5), 16), parseInt(textColor.slice(5, 7), 16))
      }

      // Split long lines
      const textLines = pdf.splitTextToSize(line, contentWidth)
      for (const textLine of textLines) {
        if (yPosition + lineHeight > pageHeight) {
          pdf.setTextColor(150, 150, 150)
          pdf.setFontSize(9)
          pdf.setFont('helvetica', 'normal')
          pdf.text(`Page ${pdf.internal.pages.length}`, pdfWidth - margin - 10, pdfHeight - 5)
          
          pdf.addPage()
          yPosition = margin
          pdf.setFont('times', 'normal')
          pdf.setFontSize(11)
          pdf.setTextColor(parseInt(textColor.slice(1, 3), 16), parseInt(textColor.slice(3, 5), 16), parseInt(textColor.slice(5, 7), 16))
        }
        pdf.text(textLine, margin, yPosition)
        yPosition += lineHeight
      }

      // Add extra space after headings
      if (isHeading) {
        yPosition += lineHeight * 0.3
        pdf.setFont('times', 'normal')
        pdf.setFontSize(11)
        pdf.setTextColor(parseInt(textColor.slice(1, 3), 16), parseInt(textColor.slice(3, 5), 16), parseInt(textColor.slice(5, 7), 16))
      }
    }

    // Add page number to last page
    pdf.setTextColor(150, 150, 150)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Page ${pdf.internal.pages.length}`, pdfWidth - margin - 10, pdfHeight - 5)

    // Save the PDF
    pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
  }
}
