var parser, xmlDoc;
var text = "<trkseg><trkpt lat="46.003257147967815399169921875" lon="8.95168307237327098846435546875"><ele>281.600006103515625</ele><time>2017-06-07T12:55:10.000Z</time><extensions><ns3:TrackPointExtension><ns3:hr>83</ns3:hr><ns3:cad>59</ns3:cad></ns3:TrackPointExtension></extensions></trkpt>"


parser = new DOMParser();

xmlDoc = parser.parseFromString(text,"text/xml");

document.getElementById("temp").innerHTML = xmlDoc.getElementsByTagName("trkseg")[0].getElementsByTagName("ele")[0].childNodes[0].nodeValue;

console.log
