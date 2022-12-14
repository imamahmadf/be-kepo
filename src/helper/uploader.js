const multer = require("multer");
const fs = require("fs");
const { nanoid } = require("nanoid");

const fileUploader = ({
  destinationFolder = "",
  prefix = "POST",
  fileType = "image",
}) => {
  console.log("Test di uploaderr");

  //storage config mengatur tujuan folder disimpan
  // dan nama filenya
  const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/../public/${destinationFolder}`);
    },
    filename: (req, file, cb) => {
      const fileExtension = file.mimetype.split("/")[1];
      // image/jpeg
      // index = jpeg

      // "POST_qwer1234566.jpeg"
      const filename = `${prefix}_${nanoid()}.${fileExtension}`;

      cb(null, filename);
    },
  });

  const uploader = multer({
    storage: storageConfig,

    fileFilter: (req, file, cb) => {
      console.log(file);
      if (file.mimetype.split("/")[0] != fileType) {
        return cb(null, false);
      }

      cb(null, true);
    },
  });

  return uploader;
};

module.exports = fileUploader;

///////////////////////////////////////////////////
//////////// dari video learning /////////////////
/////////////////////////////////////////////////

// module.exports = {
//   uploader: (directory, fileNamePrefix) => {
//     // Lokasi penyimpanan file
//     let defaultDir = "./public";

//     // diskStorage : untuk menyimpan file dari FE ke directory BE
//     const storage = multer.diskStorage({
//       destination: (req, file, cb) => {
//         const pathDir = defaultDir + directory;

//         if (fs.existsSync(pathDir)) {
//           console.log("Directory ada ✔");
//           cb(null, pathDir);
//         } else {
//           fs.mkdir(pathDir, { recursive: true }, (err) => cb(err, pathDir));
//         }
//       },
//       filename: (req, file, cb) => {
//         let ext = file.originalname.split(".");
//         let filename = fileNamePrefix + Date.now() + "." + ext[ext.length - 1];
//         cb(null, filename);
//       },
//     });

//     const fileFilter = (req, file, cb) => {
//       const ext = /\.(jpg|jpeg|png|gif|pdf|txt|JPG|PNG|JPEG)/;
//       if (!file.originalname.match(ext)) {
//         return cb(new Error("Your file type are denied"), false);
//       }
//       cb(null, true);
//     };

//     return multer({
//       storage,
//       fileFilter,
//     });
//   },
// };
