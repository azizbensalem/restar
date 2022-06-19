const QRCode = require('qrcode');

const generateQR = async (name, text) => {
	try {
		await QRCode.toFile(`app/assets/images/QRCode/${name}.png`, text);
	} catch (err) {
		console.log(err);
	}
}

module.exports = generateQR;