const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const crearPDF = async (nombreArchivo, datos, columnas, carpeta = "private/reportes/pdf") => {
  const folder = path.join(process.cwd(), carpeta);

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`Carpeta '${carpeta}' creada en:`, folder);
  }

  const filePath = path.join(folder, nombreArchivo);
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Estilo título
  doc.fontSize(18).fillColor("#000").text("Reporte de Datos", { align: "center" });
  doc.moveDown();

  const tableTop = doc.y + 10;
  const rowHeight = 25;
  const columnWidth = 540 / columnas.length;
  const startX = doc.page.margins.left;

  // Encabezados
  columnas.forEach((col, i) => {
    doc
      .fillColor("white")
      .rect(startX + i * columnWidth, tableTop, columnWidth, rowHeight)
      .fill("#4472C4")
      .stroke()
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(col, startX + i * columnWidth + 5, tableTop + 7, {
        width: columnWidth - 10,
        align: "center"
      });
  });

  // Filas de datos
  datos.forEach((fila, rowIndex) => {
    const y = tableTop + (rowIndex + 1) * rowHeight;
    const backgroundColor = rowIndex % 2 === 0 ? "#D9E1F2" : "#FFFFFF";

    fila.forEach((celda, colIndex) => {
      doc
        .fillColor("black")
        .rect(startX + colIndex * columnWidth, y, columnWidth, rowHeight)
        .fill(backgroundColor)
        .stroke()
        .fillColor("black")
        .font("Helvetica")
        .fontSize(10)
        .text(String(celda), startX + colIndex * columnWidth + 5, y + 7, {
          width: columnWidth - 10,
          align: "center"
        });
    });
  });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

module.exports = { crearPDF };
