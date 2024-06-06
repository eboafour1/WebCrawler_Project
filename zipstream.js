// create a zip stream
const zip = new ZipStream();
const zipFile = fs.createWriteStream(`${destinationFolder}/${zipFileName}`);
zip.pipe(zipFile);