import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { renderAsync } from 'docx-preview';
 
@Component({
  selector: 'app-user-manual',
  imports: [],
  templateUrl: './user-manual.html',
  styleUrl: './user-manual.css',
})
export class UserManual implements OnInit {
  // Target container in template where the docx will render
  @ViewChild('documentContainer', { static: true }) documentContainer!: ElementRef;
 
  // Paths
  fileUrl = 'assets/docs/user_manual.docx';
  fileName = 'user_manual.docx';
 
  isLoading = true;
  errorMessage = '';
 
  ngOnInit(): void {
    this.loadAndRenderDocx();
  }
 
  // Fetch file and render inside the DOM
  async loadAndRenderDocx(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await fetch(this.fileUrl);
 
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`);
      }
 
      const blob = await response.blob();
 
      // Render the docx file into the container element
      await renderAsync(blob, this.documentContainer.nativeElement, undefined, {
        className: 'docx-preview-style',
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
      });
 
      this.isLoading = false;
    } catch (error) {
      console.error('Error rendering document:', error);
      this.errorMessage = 'Could not load the manual file. Please try downloading it instead.';
      this.isLoading = false;
    }
  }
 
  // Download the original Word file
  downloadManual(): void {
    const link = document.createElement('a');
    link.href = this.fileUrl;
    link.download = this.fileName;
    link.click();
  }
 
  // Print the rendered document page
  printManual(): void {

  const documentContainer =
    document.querySelector('.document-viewer');

  if (!documentContainer) {
    console.error('Document not found');
    return;
  }

  const printWindow = window.open(
    '',
    '_blank',
    'width=1000,height=800'
  );

  if (!printWindow) {
    alert('Please allow pop-ups to print the document.');
    return;
  }

  printWindow.document.open();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>

      <title>Employee Onboarding and Management Portal Manual</title>

      <style>

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: white;
        }

        body {
          font-family: Arial, sans-serif;
        }

        .print-container {
          width: 100%;
          background: white;
        }

        /* docx-preview wrapper */

        .docx-wrapper {
          background: white !important;
          padding: 0 !important;
        }

        /* Word pages */

        .docx-wrapper > section {
          background: white !important;

          margin: 0 auto !important;

          box-shadow: none !important;

          page-break-after: always;
        }

        .docx-wrapper > section:last-child {
          page-break-after: auto;
        }

        @media print {

          @page {
            margin: 15mm;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .print-container {
            width: 100%;
          }

        }

      </style>

    </head>

    <body>

      <div class="print-container">
        ${documentContainer.innerHTML}
      </div>

    </body>

    </html>
  `);

  printWindow.document.close();

  /*
   * Wait until the document is completely rendered
   * before opening the print dialog.
   */

  printWindow.onload = () => {

    setTimeout(() => {

      printWindow.focus();

      printWindow.print();

      printWindow.close();

    }, 500);

  };

}
}
 