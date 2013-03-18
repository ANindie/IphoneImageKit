all : ExportToPNGHD.jsx
	echo "Nice try! Hey he! Nothing to compile; try make install!"
	


ScriptFolderPath=/Presets/Scripts/


PhotoshopPath=$(shell echo /Applications/Adobe\ Photoshop\ */ |head -n 1)
	
	

install : ExportToPNGHD.jsx 
	install ExportToPNGHD.jsx "$(PhotoshopPath)/$(ScriptFolderPath)"
