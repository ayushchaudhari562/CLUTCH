//this file  i have to read very carefully ..so mainpoint;
//...
//..

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const xlsx = require('xlsx');
const path = require('path');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // 1. Read the Excel file
    const filePath = path.join(__dirname, 'college_name', 'college_codes.xlsx');
    console.log(`Reading Excel file from: ${filePath}`);
    
    const workbook = xlsx.readFile(filePath);
    
    // Assuming data is in the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${data.length} rows in the Excel file. Processing...`);

    const collegesToInsert = [];

    // 2. Map the Excel columns to your Prisma schema
    for (const row of data) {
        // Look at the exact column headers from the Excel file
        const codeStr = row['Code'] || row['code'] || row['CODE'];
        const nameStr = row['College Name'] || row['College_Name'] || row['college name'] || row['Name'] || row['name'];
        
        if (codeStr && nameStr) {
            // Your Prisma schema uses 'id' (Int) and 'name' (String)
            collegesToInsert.push({
                id: parseInt(codeStr.toString().trim(), 10),
                name: nameStr.toString().trim()
            });
        }
    }

    if (collegesToInsert.length === 0) {
        console.error("No colleges found! Check the column names in your Excel file. They should be 'Code' and 'College Name'.");
        return;
    }

    console.log(`Formatted ${collegesToInsert.length} colleges. Inserting into PostgreSQL...`);

    // 3. Insert all at once!
    const result = await prisma.colleges.createMany({
        data: collegesToInsert,
        skipDuplicates: true
    });

    
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
