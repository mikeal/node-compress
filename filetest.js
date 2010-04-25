var compress=require("./compress");
var sys=require("sys");
var fs=require("fs");

// Read in our test file
var data=fs.cat("filetest.js", encoding="binary").wait();
sys.puts("Got : "+data.length);

// Set output file
var fd = fs.open("filetest.js.gz", process.O_WRONLY | process.O_TRUNC | process.O_CREAT, 0644).wait();
sys.puts("Openned file");

// Create gzip stream
var gzip=new compress.Gzip;
gzip.init();

// Pump data to be compressed
gzdata=gzip.deflate(data, "binary");  // Do this as many times as required
sys.puts("Compressed size : "+gzdata.length);
fs.write(fd, gzdata, encoding="binary").wait();

// Get the last bit
gzlast=gzip.end();
sys.puts("Last bit : "+gzlast.length);
fs.write(fd, gzlast, encoding="binary").wait();
fs.close(fd).wait();
sys.puts("File closed");

// See if we can uncompress it ok
var gunzip=new compress.Gunzip;
gunzip.init();
var testdata = fs.cat("filetest.js.gz", encoding="binary").wait();
sys.puts("Test opened : "+testdata.length);
sys.puts(gunzip.inflate(testdata, "binary").length);
gunzip.end();






