import PDFDocument from 'pdfkit';
import path from 'path';
import Image from '../models/imagesModel.js';

export const generateReport = async (campaign) => {

    return new Promise(async (resolve, reject) => {
        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        doc.on('error', (err) => {
            reject(err);
        });

        const rectStartY = doc.y;

        // Generate PDF content
        doc.font('Helvetica-BoldOblique')
        .fontSize(20)
        .text(`Report for ${campaign.name}`, {
            align: 'center',
            underline: true // Apply underline here
        });
     

        doc.font('Helvetica-BoldOblique').fontSize(12).text(`Completion Date: ${campaign.completionDate.toDateString()}`);
        doc.font('Helvetica-BoldOblique').fontSize(12).text(`Client: ${campaign.clientName}`);
        doc.font('Helvetica-BoldOblique').fontSize(12).text(`City: ${campaign.city}`);
        doc.font('Helvetica-BoldOblique').fontSize(12).text(`Neighborhood: ${campaign.neighborhood}`);
        doc.font('Helvetica-BoldOblique').fontSize(12).text(`Posters or Contacts: ${campaign.postersOrContacts}`);
        doc.font('Helvetica-BoldOblique').fontSize(12).text(`Type: ${campaign.type}`);
        doc.font('Helvetica-BoldOblique').fontSize(12).text(`Quoted Rate: ${campaign.quotedRate}`);
        doc.moveDown(1.5); 

        doc.font('Helvetica-BoldOblique').fontSize(12).text('Accepted Images:');
        
        const margin = 50;
        const imageHeight = 150;
        const imageWidth = 150;
        const imagesPerRow = 3;
        const horizontalSpacing = 30;
        const verticalSpacing = 30;
        let yPos = doc.y + 10;
        let imageCount = 0;
        let xPos = margin;

        for (const imageId of campaign.images) {
            try {
                const img = await Image.findById(imageId);

                if (img && img.approved) { 
                    const ext = path.extname(img.thumbnailName).toLowerCase();

                    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                        const imagePath = path.resolve('uploads', img.thumbnailName);

                        if (yPos + imageHeight + verticalSpacing > doc.page.height - 50) { 
                            doc.addPage();
                            yPos = margin;
                            xPos = margin;
                            imageCount = 0;
                        }

                        doc.rect(xPos, yPos, imageWidth, imageHeight).stroke('black');
                        doc.image(imagePath, xPos, yPos, { width: imageWidth, height: imageHeight });

                        imageCount++;
                        if (imageCount % imagesPerRow === 0) {
                            xPos = margin; 
                            yPos += imageHeight + verticalSpacing;
                        } else {
                            xPos += imageWidth + horizontalSpacing;
                        }
                    } else {
                        console.log(`Skipping file ${img.imageName} due to unsupported file type: ${ext}`);
                    }
                }
            } catch (error) {
                console.error("Error adding image to PDF:", error);
            }
        }

        const rectEndY = yPos + imageHeight + verticalSpacing; 
        const rectWidth = doc.page.width - 80; 
        const rectHeight = rectEndY - rectStartY + 20; 

        doc.rect(40, rectStartY - 10, rectWidth, rectHeight).stroke(); // Adjust the rectangle to fit the content

        doc.end();
    });
};
