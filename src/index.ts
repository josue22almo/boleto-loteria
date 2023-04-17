import * as fs from "fs";
import { createCanvas, loadImage } from "canvas";
import PDFDocument from 'pdfkit';

async function createImage(imageName: string, text: string) {
    const width = 1200;
    const height = 627;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    const image = await loadImage("./fondo.png");

    context.drawImage(image, 0, 0, width, height);

    context.font = "bold 70pt 'PT Sans'";
    context.textAlign = "center";
    context.fillStyle = "red";
    context.fillText(text, 500, 600);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(imageName, buffer);

    console.log("Created image: " + imageName + " with text: " + text);
}


function fillZeros(number: number, length: number) {
    let str = number.toString();
    while (str.length < length) {
        str = "0" + str;
    }
    return str;
}

async function run() {
    let doc = new PDFDocument({
        size: "A4",
        margins: {
            top: 50,
            bottom: 50,
            left: 0,
            right: 0
        }}
    );

    let inicialPDFindex = 0;

    doc.pipe(fs.createWriteStream(`./pdfs/de-${inicialPDFindex}-a-${inicialPDFindex+39}.pdf`));


    let imagesPerPages = 0;

    // for(let i = 0; i < 1000; i += 2) {
    //     const imageName = `./images/de-${i}-a-${i+1}.png`;
    //     const text = fillZeros(i, 3) + " - " + fillZeros(i+1, 3);
    //     await createImage(imageName, text);
    // }

    for(let i = 0; i < 1000; i+=2) {
        if (i % 40 === 0 && i > 0) {
            doc.end();
            break;
            // doc = new PDFDocument({
            //     size: "A4",
            //     margins: {
            //         top: 50,
            //         bottom: 50,
            //         left: 0,
            //         right: 0
            //     }});
            // inicialPDFindex = i;
            // imagesPerPages = 0;
            // doc.pipe(fs.createWriteStream(`./pdfs/de-${inicialPDFindex}-a-${inicialPDFindex+39}.pdf`));
        }
        const imageName = `./images/de-${i}-a-${i+1}.png`;
        doc.image(imageName, {
            scale: 0.50,
            align: 'left',
            valign: 'center'
        } as any);

        doc.text("  ");
        ++imagesPerPages;


        if (imagesPerPages === 2) {
            // add new line to doc
            imagesPerPages = 0;

            if (i % 40 === 0 && i > 0) {
                doc.addPage({
                    size: "A4",
                    margins: {
                        top: 50,
                        bottom: 50,
                        left: 0,
                        right: 0
                    }
                })
            }
        }
    }

}

void run().then(() => {
    console.log("Done!");
    // process.exit(0);
});