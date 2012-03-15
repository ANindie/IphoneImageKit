all : ExportToPNGHD.jsx
	echo "Nice try! Hey he! Nothing to compile; try make install!"
	
PhotoshopPath=/Applications/Adobe\ Photoshop\ CS4/
ScriptFolderPath=$(PhotoshopPath)/Presets/Scripts/

install : ExportToPNGHD.jsx  $(ScriptFolderPath)
	install ExportToPNGHD.jsx $(ScriptFolderPath)
	