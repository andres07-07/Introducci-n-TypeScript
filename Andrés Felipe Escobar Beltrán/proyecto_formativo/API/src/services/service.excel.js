import fs from 'fs';
import path from 'path';
import XlsxPopulate from 'xlsx-populate';

/**
 * CreaR un archivo Excel con datos personalizados.
 *
 * @param {string} nombreArchivo - Nombre del archivo Excel a generar.
 * @param {Array} datos - Datos a escribir. Pueden ser arreglos de objetos o de arreglos.
 * @param {Array} columnas - Si los datos son objetos: [{ header: 'Nombre', key: 'nombre' }, ...]
 *                           Si los datos son arreglos: ['Nombre', 'Edad', ...]
 * @param {string} carpeta - Carpeta donde se guardará el archivo.
 * @returns {Promise<string>} Ruta del archivo generado.
 */
export const crearExcel = async (nombreArchivo, datos, columnas, carpeta = "private/reportes/excel") => {
  const folder = path.join(process.cwd(), carpeta);

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`Carpeta '${carpeta}' creada en:`, folder);
  }

  const filePath = path.join(folder, nombreArchivo);
  const workbook = await XlsxPopulate.fromBlankAsync();
  const sheet = workbook.sheet(0);

  const esFormatoObjeto = typeof columnas[0] === 'object' && columnas[0].key;

  // Escribir encabezados
  columnas.forEach((col, index) => {
    const header = esFormatoObjeto ? col.header : col;
    const cell = sheet.cell(1, index + 1);
    cell.value(header)
      .style({
        bold: true,
        fill: "4472C4",
        fontColor: "FFFFFF",
        fontSize: 14,
        horizontalAlignment: "center",
        border: {
          left: { style: "thin" },
          right: { style: "thin" },
          top: { style: "thin" },
          bottom: { style: "thin" }
        }
      });

    // Ajuste manual del ancho de columna
    sheet.column(index + 1).width(header.length + 8); // Ajustar este número 
  });

  sheet.row(1).height(25);

  // Escribir filas
  datos.forEach((fila, rowIndex) => {
    const isEven = rowIndex % 2 === 0;
    columnas.forEach((col, colIndex) => {
      const valor = esFormatoObjeto ? fila[col.key] : fila[colIndex];
      const cell = sheet.cell(rowIndex + 2, colIndex + 1);
      cell.value(valor ?? "")
        .style({
          fill: isEven ? "D9E1F2" : "FFFFFF",
          border: {
            left: { style: "thin" },
            right: { style: "thin" },
            top: { style: "thin" },
            bottom: { style: "thin" }
          },
          horizontalAlignment: "center"
        });
    });
  });

  await workbook.toFileAsync(filePath);
  return filePath;
};
