const {
  authorizeAndList,
  authorizeAndUpload
} = require("../uploadAndDownload/upload");

authorizeAndList((name, link) => {
  try {
    console.log(name, "   ", link);
  } catch (error) {
    console.log(error);
  }
});

authorizeAndUpload("1pOwfE7sRocgA_ncqu_SXEs1z8-xXjqKP", id => {
  try {
    console.log(id);
  } catch (error) {
    console.log(error);
  }
});
