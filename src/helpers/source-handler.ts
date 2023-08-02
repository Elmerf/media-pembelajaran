const handleSource = (extension: any, url: any) => {
  switch (extension) {
    case "ppt":
    case "pptx":
    case "doc":
    case "docx":
    case "xls":
    case "xlsx":
      return `https://view.officeapps.live.com/op/embed.aspx?src=${url}`;
    default:
      return url;
  }
};

export default handleSource;
