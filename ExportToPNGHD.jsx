/*
@@@BUILDINFO@@@ ExportToPNGHD.jsx 1.0.0.29
*/

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/ExportToPNGHD/Menu=Export layer groups ...</name>
<category>layers</category>
<enableinfo>true</enableinfo>
<eventid>e805a6ee-6d75-4b62-b6fe-f5873b5fdf20</eventid>
<terminology><![CDATA[<< /Version 1 
                         /Events << 
                          /e805a6ee-6d75-4b62-b6fe-f5873b5fdf20 [($$$/JavaScripts/ExportToPNGHD/Menu=Export layer groups ...) /noDirectParam <<
                          >>] 
                         >> 
                      >> ]]></terminology>
</javascriptresource>

</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/



#target photoshop
//An indie
//Original source: http://forums.adobe.com/message/3442865 by Paul Riggott
function main()
{


	if ( app.documents.length <= 0 ) 
	{
        if ( DialogModes.NO != app.playbackDisplayDialogs ) 
		{
            alert( "Document must be open" );
        }
    	return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
    }
	
	
	
	
	
	
    var exportInfo = new Object();
    
    initExportInfo(exportInfo);
    
 	// look for last used params via Photoshop registry, getCustomOptions will throw if none exist
	try {
		var d = app.getCustomOptions("3CE7FAA9-3C68-4FAE-8F04-6CC1D626B9B4");
		descriptorToObject(exportInfo, d, "ExportPNHDSettings", false);
	}
	catch(e) {
		// it's ok if we don't have any options, continue with defaults
	}

	// see if I am getting descriptor parameters
    descriptorToObject(exportInfo, app.playbackParameters, "ExportPNHDSettings", false);
    
	

    var LSets = activeDocument.layerSets.length;
    var ArtLayers = activeDocument.artLayers.length;
    var NoOfLayers = activeDocument.layers.length;
    var Back = hasBackground();
    var hasTop = false;
    var selLayers =getSelectedLayersIdx();
    var selGroups=[];
    if(LSets>0)
    {
        for(var s in selLayers)
        {
            if(isLayerSet(selLayers[s])) selGroups.push(selLayers[s]);
        }
    }
    if(activeDocument.layers[0].typename == 'ArtLayer') hasTop = true;
    var win = new Window('dialog','Layer Saver');
    g = win.graphics;
    var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.99, 0.99, 0.99, 1]);
    g.backgroundColor = myBrush;
	win.p1= win.add("panel", undefined, undefined, {borderStyle:"black"});
    win.p1.preferredSize=[500,20];
    win.g1 = win.p1.add('group');
    win.g1.orientation = "row";
    win.title = win.g1.add('statictext',undefined,'Layer Saver');
    win.title.alignment="fill";
    var g = win.title.graphics;
    g.font = ScriptUI.newFont("Georgia","BOLDITALIC",22);
    win.g5 =win.p1.add('group');
    win.g5.orientation = "column";
    win.g5.alignChildren='left';
    win.g5.spacing=0;
    if(LSets == 0)
    {
	   if(selLayers.length >1)
			win.g5.rb1 = win.g5.add('radiobutton',undefined,'Save selected layers');
		else 
			win.g5.rb1 = win.g5.add('radiobutton',undefined,'Save selected layers');
		
        win.g5.rb4 = win.g5.add('radiobutton',undefined,'Save all layers');
        win.g5.rb1.value=true;
    }
    else
    {
		 if(selGroups.length >0)
		 {
			 if(selGroups.length >1)
				win.g5.rb1 = win.g5.add('radiobutton',undefined,'Save selected Groups');
			 else
				win.g5.rb1 = win.g5.add('radiobutton',undefined,'Save selected Group');
				
	    	  win.g5.rb1.value=true;
		  }

        win.g5.rb4 = win.g5.add('radiobutton',undefined,'Save all Groups');
		if(selLayers.length - selGroups.length >0)
		{
		 if(selLayers.length < 2)
			win.g5.rb7 = win.g5.add('radiobutton',undefined,'Save selected layer');
		 else if (selLayers.length )
		      win.g5.rb7 = win.g5.add('radiobutton',undefined,'Save selected layers');
		}

        if(selGroups.length <1)
        {
	    	win.g5.rb7.value=true;
		}
	

	
	
    }

     win.g5.rb8 = win.g5.add('radiobutton',undefined,'Save entire image');


	win.p2 = win.add("panel", undefined, undefined, {borderStyle:"black"});
    win.p2.preferredSize=[500,20];
    win.p2.st1 = win.p2.add('statictext',undefined,'Output details');
    win.p2.st1.graphics.font = ScriptUI.newFont("Tahoma", "Bold", 18);
    win.g10 =win.p2.add('group');
    win.g10.orientation = "row";
    win.g10.alignment='left';
    win.g10.et1 = win.g10.add('edittext');
    win.g10.et1.preferredSize=[350,20];
    win.g10.bu1 = win.g10.add('button',undefined,'Select Folder');
  
    outputFolder =  Folder(exportInfo.destination);
	win.g10.et1.text =  decodeURI(outputFolder.fsName);
    win.g10.bu1.onClick=function()
    {

        outputFolder =  outputFolder.selectDlg();
         if(outputFolder !=null)
        {
            win.g10.et1.text =  decodeURI(outputFolder.fsName);
			exportInfo.destination=win.g10.et1.text;
        }
    }
    win.g12 =win.p2.add('group');
    win.g12.orientation = "row";
    win.g12.alignment='left';


    win.g12.cb2 = win.g12.add('checkbox',undefined,'Trim Layer');
    win.g12.cb2.value = exportInfo.trim;
    win.g12.cb3 = win.g12.add('checkbox',undefined,'Hd');
	win.g12.cb3.value = exportInfo.hd;
    win.g15 =win.p2.add('group');
    win.g15.orientation = "row";
    win.g15.alignment='left';
    var Options= ["Layer/Group Name","FileName + Sequence No.","FileName + Layer/Group Name ","User Defined with Sequence No."];
    win.g15.st1 = win.g15.add('statictext',undefined,'Save Options..');
    win.g15.dd1 = win.g15.add('dropdownlist',undefined,Options);
    win.g15.dd1.selection=0;
    win.g15.et1 = win.g15.add('edittext');
    win.g15.et1.preferredSize=[150,20];
    win.g15.et1.hide();
    win.g15.dd1.onChange=function()
    {
        if(this.selection.index==3)
        {
            win.g15.et1.show();
        }
        else
        {
            win.g15.et1.hide();
        }
    }
    win.g18 =win.p2.add('group');
    win.g18.orientation = "row";
//    win.g18.st1 = win.g18.add('statictext',undefined,'Save as :');
//    var Types = ["PNG","PSD","PDF","TIF","JPG"];
//    win.g18.dd1 = win.g18.add('dropdownlist',undefined,Types);
//    win.g18.dd1.selection = 0;
    win.g18.alignment='left';
    win.g20 =win.p2.add('group');
    win.g20.orientation = "row";
    win.g20.bu2 = win.g20.add('button',undefined,'Cancel');
    win.g20.bu2.preferredSize=[200,35];
	win.g20.bu1 = win.g20.add('button',undefined,'Process');
    win.g20.bu1.preferredSize=[200,35];
	win.defaultElement = win.g20.bu1;
	win.cancelElement = win.g20.bu2;
	
    win.g20.bu1.onClick=function()
    {
        if(win.g10.et1.text == '')
        {
            alert("No Output Folder has been Selected!");
            return;
        }
        if(win.g15.dd1.selection.index==3)
        {
            if(win.g15.et1.text =='')
            {
                alert("No FileName Has Been Entered!");
                return;
            }
        }
        win.close(1);
        Process();
		for(var b in selLayers)
         {
                    selectLayerByIndex(Number(selLayers[b]));
		}
		
    }
    win.center();
    win.show();
    function Process()
    {

		if(win.g5.rb8.value)//entair image
		{

			var dName = decodeURI(activeDocument.name).replace(/\.[^\.]+$/, '');

			
		       activeDocument= activeDocument.duplicate();
			  
					

                    var saveFile= File(outputFolder+ "/" + getName(b,dName));
                    try
                    {
                          activeDocument.mergeVisibleLayers();
                    }
                    catch(e) {}
                    if(win.g12.cb2.value)
                    {
                        try
                        {
                            activeDocument.trim(TrimType.TRANSPARENT,true,true,true,true);
                        }
                        catch(e) {}
                    }
                    SaveDOC(saveFile);
                    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                
			
			}

        else if(LSets == 0)
        {
//Process layers only
            if(win.g5.rb1.value) //Save selected layers
            {
                for(var b in selLayers)
                {
                    selectLayerByIndex(Number(selLayers[b]));
                    var lName = activeDocument.activeLayer.name;
                    var saveFile= File(outputFolder+ "/" + getName(b,lName));
                    dupLayers();
                    {
                        try
                        {
                            activeDocument.mergeVisibleLayers();
                        }
                        catch(e) {}
                    }
                    if(win.g12.cb2.value)
                    {
                        try
                        {
                            activeDocument.trim(TrimType.TRANSPARENT,true,true,true,true);
                        }
                        catch(e) {}
                    }
                    SaveDOC(saveFile);
                    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                }
            }//End Save selected layers
          
        
         else   if(win.g5.rb4.value) //Save all layers
            {
                selectAllLayers();
                selLayers =getSelectedLayersIdx();
                for(var b in selLayers)
                {
                    selectLayerByIndex(Number(selLayers[b]));
                    var lName = activeDocument.activeLayer.name;
                    var saveFile= File(outputFolder+ "/" + getName(b,lName));
                    dupLayers();
                    try
                    {
                          activeDocument.mergeVisibleLayers();
                    }
                    catch(e) {}
                    if(win.g12.cb2.value)
                    {
                        try
                        {
                            activeDocument.trim(TrimType.TRANSPARENT,true,true,true,true);
                        }
                        catch(e) {}
                    }
                    SaveDOC(saveFile);
                    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                }
            }//End Save all layers
		}
        else
        {
//Process LayerSets Only
            if(win.g5.rb7 && win.g5.rb7.value) //Save selected layers
            {
                for(var b in selLayers)
                {
                    selectLayerByIndex(Number(selLayers[b]));
                    var lName = activeDocument.activeLayer.name;
                    var saveFile= File(outputFolder+ "/" + getName(b,lName));
                    dupLayers();
                    {
                        /*         try
                                 {
                                     activeDocument.mergeVisibleLayers();
                                 }
                                 catch(e) {}
                        *///do not merge now
                    }
                    if(win.g12.cb2.value)
                    {
                        try
                        {
                            activeDocument.trim(TrimType.TRANSPARENT,true,true,true,true);
                        }
                        catch(e) {}
                    }
                    SaveDOC(saveFile);
                    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                }
            }//End Save selected layers
			
			
		else

            if(win.g5.rb1.value) //Save selected layerSets
            {
                for(var g in selGroups)
                {
                    selectLayerByIndex(Number(selGroups[g]));
                    var lName = activeDocument.activeLayer.name;
                    var saveFile= File(outputFolder+ "/" + getName(g,lName));
                    dupLayers();
                    {
                        try
                        {
                            activeDocument.mergeVisibleLayers();
                        }
                        catch(e) {}
                    }
                    if(win.g12.cb2.value)
                    {
                        try
                        {
                            activeDocument.trim(TrimType.TRANSPARENT,true,true,true,true);
                        }
                        catch(e) {}
                    }
                    SaveDOC(saveFile);
                    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                }
            }//End Save selected layerSets
            if(win.g5.rb4.value) //Save all layerSets
            {
                for(var g =0; g<LSets; g++)
                {
                    activeDocument.activeLayer = activeDocument.layerSets[g];
                    var lName = activeDocument.activeLayer.name;
                    var saveFile= File(outputFolder+ "/" + getName(g,lName));
                    dupLayers();
                    {
                        try
                        {
                            activeDocument.mergeVisibleLayers();
                        }
                        catch(e) {}
                    }
                    if(win.g12.cb2.value)
                    {
                        try
                        {
                            activeDocument.trim(TrimType.TRANSPARENT,true,true,true,true);
                        }
                        catch(e) {}
                    }
                    SaveDOC(saveFile);
                    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                }
            }//End Save all layerSets
        
        }
    
	  
	
	}
    function getName(seq,lName)
    {
        seq = zeroPad((Number(seq)+1), 3);
        var dName = decodeURI(activeDocument.name).replace(/\.[^\.]+$/, '');
        var Name ='';
        switch (Number(win.g15.dd1.selection.index))
        {
        case 0:
            Name += lName;
            break;
        case 1:
            Name += dName +"-"+seq;
            break;
        case 2:
            Name += dName +"-"+ lName;
            break;
        case 3:
            Name += win.g15.et1.text + "-"+seq;
            break;
        default :
            break;
        }
        return Name;
    }
    function SaveDOC(saveFile)
    {
		try
		{
		activeDocument.mergeVisibleLayers();
		}
		catch(e) {}

				
		try
		{
			
				if(win.g12.cb3.value)
				{

					SavePNG(File(saveFile+"-hd.png"));

					width =  activeDocument.width / 2;
					height = activeDocument.height / 2;

					activeDocument.resizeImage(width,height,null,ResampleMethod.BICUBIC);
				}
				SavePNG(File(saveFile+".png"));
		
			}
		catch(e) 
		{
            alert("Error occured while saving file");

		
		
		}


		
    }



	 exportInfo.trim=win.g12.cb2.value;
	 exportInfo.hd = win.g12.cb3.value;



	
	
	var d = objectToDescriptor(exportInfo,"ExportPNHDSettings");
            app.putCustomOptions("3CE7FAA9-3C68-4FAE-8F04-6CC1D626B9B4", d);

			var dd = objectToDescriptor(exportInfo, "ExportPNHDSettings");
            app.playbackParameters = dd;
			
			
	
}

function hasBackground()
{
    var ref = new ActionReference();
    ref.putProperty( charIDToTypeID("Prpr"), charIDToTypeID( "Bckg" ));
    ref.putEnumerated(charIDToTypeID( "Lyr " ),charIDToTypeID( "Ordn" ),charIDToTypeID( "Back" ));
    var desc =  executeActionGet(ref);
    var res = desc.getBoolean(charIDToTypeID( "Bckg" ));
    return res
}
       function getSelectedLayersIdx()
{
    var selectedLayers = new Array;
    var ref = new ActionReference();
    ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
    var desc = executeActionGet(ref);
    if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) )
    {
        desc = desc.getList( stringIDToTypeID( 'targetLayers' ));
        var c = desc.count
                var selectedLayers = new Array();
        for(var i=0; i<c; i++)
        {
            try
            {
                activeDocument.backgroundLayer;
                selectedLayers.push(  desc.getReference( i ).getIndex() );
            }
            catch(e)
            {
                selectedLayers.push(  desc.getReference( i ).getIndex()+1 );
            }
        }
    }
    else
    {
        var ref = new ActionReference();
        ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));
        ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
        try
        {
            activeDocument.backgroundLayer;
            selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1);
        }
        catch(e)
        {
            selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" )));
        }
    }
    return selectedLayers;
};
function isLayerSet(idx)
{
    var ref = new ActionReference();
    ref.putIndex(1283027488, idx);
    var desc =  executeActionGet(ref);
    var type = desc.getEnumerationValue(stringIDToTypeID("layerSection"));
    var res = typeIDToStringID(type);
    if(res == 'layerSectionStart') return true;
    return false;
}
function dupLayers()
{
    var desc143 = new ActionDescriptor();
    var ref73 = new ActionReference();
    ref73.putClass( charIDToTypeID('Dcmn') );
    desc143.putReference( charIDToTypeID('null'), ref73 );
    desc143.putString( charIDToTypeID('Nm  '), activeDocument.activeLayer.name );
    var ref74 = new ActionReference();
    ref74.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    desc143.putReference( charIDToTypeID('Usng'), ref74 );
    executeAction( charIDToTypeID('Mk  '), desc143, DialogModes.NO );
};
function selectLayerByIndex(index,add)
{
    add = (add == undefined)  ? add = false : add;
    var ref = new ActionReference();
    ref.putIndex(charIDToTypeID("Lyr "), index);
    var desc = new ActionDescriptor();
    desc.putReference(charIDToTypeID("null"), ref );
    if(add) desc.putEnumerated( stringIDToTypeID( "selectionModifier" ), stringIDToTypeID( "selectionModifierType" ), stringIDToTypeID( "addToSelection" ) );
    desc.putBoolean( charIDToTypeID( "MkVs" ), false );
    try
    {
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO );
    }
    catch(e) {}
};
function selectAllLayers(layer)  //does not select background layer
{
    if(layer == undefined) layer = 0;
    activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-1];
    if(activeDocument.activeLayer.isBackgroundLayer)
        activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-2];
    var BL = activeDocument.activeLayer.name;
    activeDocument.activeLayer = activeDocument.layers[layer];
    var desc5 = new ActionDescriptor();
    var ref3 = new ActionReference();
    ref3.putName( charIDToTypeID('Lyr '), BL);
    desc5.putReference( charIDToTypeID('null'), ref3 );
    desc5.putEnumerated( stringIDToTypeID('selectionModifier'), stringIDToTypeID('selectionModifierType'), stringIDToTypeID('addToSelectionContinuous') );
    desc5.putBoolean( charIDToTypeID('MkVs'), false );
    executeAction( charIDToTypeID('slct'), desc5, DialogModes.NO );
};
function zeroPad(n, s)
{
    n = n.toString();
    while (n.length < s)  n = '0' + n;
    return n;
}
function SavePNG(saveFile)
{
    pngSaveOptions = new PNGSaveOptions();
    activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);
}
function SaveTIFF(saveFile)
{
    tiffSaveOptions = new TiffSaveOptions();
    tiffSaveOptions.embedColorProfile = true;
    tiffSaveOptions.alphaChannels = true;
    tiffSaveOptions.layers = true;
    tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW;
    activeDocument.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE);
}
function SavePSD(saveFile)
{
    psdSaveOptions = new PhotoshopSaveOptions();
    psdSaveOptions.embedColorProfile = true;
    psdSaveOptions.alphaChannels = true;
    activeDocument.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE);
}
function SavePDF(saveFile)
{
    pdfSaveOptions = new PDFSaveOptions();
    activeDocument.saveAs(saveFile, pdfSaveOptions, true, Extension.LOWERCASE);
}
function SaveJPG(saveFile, jpegQuality)
{
    jpgSaveOptions = new JPEGSaveOptions();
    jpgSaveOptions.embedColorProfile = true;
    jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
    jpgSaveOptions.matte = MatteType.NONE;
    jpgSaveOptions.quality = jpegQuality; //1-12
    activeDocument.saveAs(saveFile, jpgSaveOptions, true,Extension.LOWERCASE);
}



///////////////////////////////////////////////////////////////////////////////
function initExportInfo(exportInfo) {
    exportInfo.destination = new String("");
    exportInfo.hd = true;
	exportInfo.mergevisible = true;
	exportInfo.trim = true;
    try {
        exportInfo.destination = Folder(app.activeDocument.fullName.parent).fsName; // destination folder
        var tmp = app.activeDocument.fullName.name;
        exportInfo.fileNamePrefix = decodeURI(tmp.substring(0, tmp.indexOf("."))); // filename body part
    } catch(someError) {
        exportInfo.destination = new String("");
        exportInfo.fileNamePrefix = app.activeDocument.name; // filename body part
    }
}




/////////////////////////////////////////////////////////////////////////////
function descriptorToObject (o, d, s, f) {
	var l = d.count;
	if (l) {
	    var keyMessage = app.charIDToTypeID( 'Msge' );
        if ( d.hasKey(keyMessage) && ( s != d.getString(keyMessage) )) return;
	}
	for (var i = 0; i < l; i++ ) {
		var k = d.getKey(i); // i + 1 ?
		var t = d.getType(k);
		strk = app.typeIDToStringID(k);
		switch (t) {
			case DescValueType.BOOLEANTYPE:
				o[strk] = d.getBoolean(k);
				break;
			case DescValueType.STRINGTYPE:
				o[strk] = d.getString(k);
				break;
			case DescValueType.DOUBLETYPE:
				o[strk] = d.getDouble(k);
				break;
			case DescValueType.UNITDOUBLE:
				{
				var uc = new Object;
				uc[charIDToTypeID("#Rlt")] = "px"; // unitDistance
				uc[charIDToTypeID("#Prc")] = "%"; // unitPercent
				uc[charIDToTypeID("#Pxl")] = "px"; // unitPixels
				var ut = d.getUnitDoubleType(k);
				var uv = d.getUnitDoubleValue(k);;
				o[strk] = new UnitValue( uv, uc[ut] );
				}
				break;
			case DescValueType.INTEGERTYPE:
			case DescValueType.ALIASTYPE:
			case DescValueType.CLASSTYPE:
			case DescValueType.ENUMERATEDTYPE:
			case DescValueType.LISTTYPE:
			case DescValueType.OBJECTTYPE:	
			case DescValueType.REFERENCETYPE:
			default:
				throw( new Error("Unsupported type in descriptorToObject " + t ) );
		}
	}
//	if (undefined != f) {
//		o = f(o);
//	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: objectToDescriptor
// Usage: create an ActionDescriptor from a JavaScript Object
// Input: JavaScript Object (o)
//        object unique string (s)
//        Pre process converter (f)
// Return: ActionDescriptor
// NOTE: Only boolean, string, number and UnitValue are supported, use a pre processor
//       to convert (f) other types to one of these forms.
// REUSE: This routine is used in other scripts. Please update those if you 
//        modify. I am not using include or eval statements as I want these 
//        scripts self contained.
///////////////////////////////////////////////////////////////////////////////
function objectToDescriptor (o, s) {
	var d = new ActionDescriptor;
	var l = o.reflect.properties.length;
	d.putString( app.charIDToTypeID( 'Msge' ), s );
	for (var i = 0; i < l; i++ ) {
		var k = o.reflect.properties[i].toString();
		if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect")
			continue;
		var v = o[ k ];
		k = app.stringIDToTypeID(k);
		switch ( typeof(v) ) {
			case "boolean":
				d.putBoolean(k, v);
				break;
			case "string":
				d.putString(k, v);
				break;
			case "number":
				d.putDouble(k, v);
				break;
			default:
			{
				if ( v instanceof UnitValue ) {
					var uc = new Object;
					uc["px"] = charIDToTypeID("#Rlt"); // unitDistance
					uc["%"] = charIDToTypeID("#Prc"); // unitPercent
					d.putUnitDouble(k, uc[v.type], v.value);
				} else {
					throw( new Error("Unsupported type in objectToDescriptor " + typeof(v) ) );
				}
			}
		}
	}
    return d;
}


main();