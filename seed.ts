import csv from "csv-parser";
import fs from "node:fs";

interface Row {
	text: string;
}

async function parseCsv(filePath: string): Promise<Row[]> {
	return new Promise((resolve, reject) => {
		const rows: Row[] = [];

		fs.createReadStream(filePath)
			.pipe(csv({ separator: "," }))
			.on("data", (row: Row) => {
				rows.push(row);
			})
			.on("error", (error: Error) => {
				reject(new Error(`Error parsing CSV file: ${error.message}`));
			})
			.on("end", () => {
				resolve(rows);
			});
	});
}

const STEP = 30;

const seed = async () => {
	const data = await parseCsv("training_dataset.csv");

	for (let i = 0; i < data.length; i += STEP) {
		const chunk = data.slice(i, i + STEP);
		const formatted = chunk.map((row, index) => ({
			data: row.text,
			id: i + index,
			metadata: { text: row.text },
		}));
		console.log(formatted);
	}
};

seed();
