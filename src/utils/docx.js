const { Document, HeadingLevel, Packer, Paragraph } = require('docx');

const docx = {};

docx.create = async (data, string) => {
  const splitText = data.split('\n');
  const paragraphs = [];
  splitText.forEach((paragraph) => {
    paragraphs.push(new Paragraph(paragraph));
  });
  const doc = new Document({
    creator: 'Feedopedia',
    title: 'Spun Owl',
    description: 'spun text downloaded from Feedopedia.com',
    sections: [
      {
        children: [
          new Paragraph({
            text: data.title,
            heading: HeadingLevel.HEADING_1,
          }),
          ...paragraphs,
        ],
      },
    ],
  });
  const result = string ? await Packer.toBase64String(doc) : await Packer.toBuffer(doc);
  return result;
};

module.exports = docx;
