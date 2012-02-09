#target photoshop
//An indie
//Original source: http://forums.adobe.com/message/3442865 by Paul Riggott
function main()
{
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
        win.g5.rb1 = win.g5.add('radiobutton',undefined,'Save selected layers');
  //      win.g5.rb2 = win.g5.add('radiobutton',undefined,'Save selected layers along with the top layer');
  //      win.g5.rb3 = win.g5.add('radiobutton',undefined,'Save selected layers along with background layer');
        win.g5.rb4 = win.g5.add('radiobutton',undefined,'Save all layers');
   //     win.g5.rb5 = win.g5.add('radiobutton',undefined,'Save all layers along with the top layer');
   //     win.g5.rb6 = win.g5.add('radiobutton',undefined,'Save all layers along with background layer');

 //       win.g5.rb3.enabled=Back;
   //     win.g5.rb6.enabled=Back;
        win.g5.rb1.value=true;
    }
    else
    {
        win.g5.rb1 = win.g5.add('radiobutton',undefined,'Save selected layerSets');
//        win.g5.rb2 = win.g5.add('radiobutton',undefined,'Save selected layerSets along with the top layer');
 //       win.g5.rb3 = win.g5.add('radiobutton',undefined,'Save selected layerSets along with background layer');
        win.g5.rb4 = win.g5.add('radiobutton',undefined,'Save all layerSets');
//        win.g5.rb5 = win.g5.add('radiobutton',undefined,'Save all layerSets along with the top layer');
//       win.g5.rb6 = win.g5.add('radiobutton',undefined,'Save all layerSets along with background layer');
        win.g5.rb7 = win.g5.add('radiobutton',undefined,'Save selected layer');//Me

//        win.g5.rb3.enabled=Back;
//        win.g5.rb6.enabled=Back;
 //       win.g5.rb2.enabled=hasTop;
//        win.g5.rb5.enabled=hasTop;
        if(selGroups.length <1)
        {
            win.g5.rb1.enabled=false;
  //          win.g5.rb2.enabled=false;
   //         win.g5.rb3.enabled=false;
        }
        win.g5.rb1.value=true;
    }
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

    outputFolder =  Folder('~/Downloads');
	win.g10.et1.text =  decodeURI(outputFolder.fsName);
    win.g10.bu1.onClick=function()
    {

        outputFolder =  outputFolder.selectDlg();
         if(outputFolder !=null)
        {
            win.g10.et1.text =  decodeURI(outputFolder.fsName);
        }
    }
    win.g12 =win.p2.add('group');
    win.g12.orientation = "row";
    win.g12.alignment='left';
    win.g12.cb1 = win.g12.add('checkbox',undefined,'Merge Visible Layers?');
    win.g12.cb2 = win.g12.add('checkbox',undefined,'Trim Layer');
    win.g12.cb3 = win.g12.add('checkbox',undefined,'Hd');
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
    win.g18.st1 = win.g18.add('statictext',undefined,'Save as :');
    var Types = ["PNG","PSD","PDF","TIF","JPG"];
    win.g18.dd1 = win.g18.add('dropdownlist',undefined,Types);
    win.g18.dd1.selection = 0;
    win.g18.alignment='left';
    win.g20 =win.p2.add('group');
    win.g20.orientation = "row";
    win.g20.bu1 = win.g20.add('button',undefined,'Process');
    win.g20.bu1.preferredSize=[200,35];
    win.g20.bu2 = win.g20.add('button',undefined,'Cancel');
    win.g20.bu2.preferredSize=[200,35];
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
    }
    win.center();
    win.show();
    function Process()
    {

//Process layers only
        if(win.g5.rb7.value) //Save selected layers
        {
            for(var b in selLayers)
            {
                selectLayerByIndex(Number(selLayers[b]));
                var lName = activeDocument.activeLayer.name;
                var saveFile= File(outputFolder+ "/" + getName(b,lName));
                dupLayers();
                if(win.g12.cb1.value)
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

        if(LSets == 0)
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
                    if(win.g12.cb1.value)
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
            if(win.g5.rb2.value) //Save selected layers along with the top layer
            {
                for(var b in selLayers)
                {
                    selectLayerByIndex(Number(selLayers[b]));
                    var lName = activeDocument.activeLayer.name;
                    activeDocument.activeLayer= activeDocument.layers[0];
                    selectLayerByIndex(Number(selLayers[b]),true);
                    var saveFile= File(outputFolder+ "/" + getName(b,lName));
                    dupLayers();
                    if(win.g12.cb1.value)
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
            }//End Save selected layers along with the top layer
            if(win.g5.rb3.value) //Save selected layers along with background layer
            {
                for(var b in selLayers)
                {
                    selectLayerByIndex(Number(selLayers[b]));
                    var lName = activeDocument.activeLayer.name;
                    activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-1];
                    selectLayerByIndex(Number(selLayers[b]),true);
                    var saveFile= File(outputFolder+ "/" + getName(b,lName));
                    dupLayers();
                    if(win.g12.cb1.value)
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
            }//End Save selected layers along with background layer
            if(win.g5.rb4.value) //Save all layers
            {
                selectAllLayers();
                selLayers =getSelectedLayersIdx();
                for(var b in selLayers)
                {
                    selectLayerByIndex(Number(selLayers[b]));
                    var lName = activeDocument.activeLayer.name;
                    var saveFile= File(outputFolder+ "/" + getName(b,lName));
                    dupLayers();
                    if(win.g12.cb1.value)
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
            }//End Save all layers
            if(win.g5.rb5.value) //Save all layers along with the top layer
            {
                selectAllLayers(1);
                selLayers =getSelectedLayersIdx();
                for(var b in selLayers)
                {
                    selectLayerByIndex(Number(selLayers[b]));
                    var lName = activeDocument.activeLayer.name;
                    activeDocument.activeLayer = activeDocument.layers[0];
                    selectLayerByIndex(Number(selLayers[b]),true);
                    var saveFile= File(outputFolder+ "/" + getName(b,lName));
                    dupLayers();
                    if(win.g12.cb1.value)
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
            }//End Save all layers along with the top layer
            if(win.g5.rb6.value) //Save all layers along with background layer
            {
                selectAllLayers();
                selLayers =getSelectedLayersIdx();
                for(var b in selLayers)
                {
                    selectLayerByIndex(Number(selLayers[b]));
                    var lName = activeDocument.activeLayer.name;
                    activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-1];
                    selectLayerByIndex(Number(selLayers[b]),true);
                    var saveFile= File(outputFolder+ "/" + getName(b,lName));
                    dupLayers();
                    if(win.g12.cb1.value)
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
            }//End Save all layers along with background layer
        }
        else
        {
//Process LayerSets Only
            if(win.g5.rb1.value) //Save selected layerSets
            {
                for(var g in selGroups)
                {
                    selectLayerByIndex(Number(selGroups[g]));
                    var lName = activeDocument.activeLayer.name;
                    var saveFile= File(outputFolder+ "/" + getName(g,lName));
                    dupLayers();
                    if(win.g12.cb1.value)
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
            if(win.g5.rb2.value) //Save selected layerSets along with the top layer
            {
                for(var g in selGroups)
                {
                    selectLayerByIndex(Number(selGroups[g]));
                    var lName = activeDocument.activeLayer.name;
                    activeDocument.activeLayer= activeDocument.layers[0];
                    selectLayerByIndex(Number(selGroups[g]),true);
                    var saveFile= File(outputFolder+ "/" + getName(g,lName));
                    dupLayers();
                    if(win.g12.cb1.value)
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
            }//End Save selected layerSets along with the top layer
            if(win.g5.rb3.value) //Save selected layerSets along with background layer
            {
                for(var g in selGroups)
                {
                    selectLayerByIndex(Number(selGroups[g]));
                    var lName = activeDocument.activeLayer.name;
                    activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-1];
                    selectLayerByIndex(Number(selGroups[g]),true);
                    var saveFile= File(outputFolder+ "/" + getName(g,lName));
                    dupLayers();
                    if(win.g12.cb1.value)
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
            }//End Save selected layerSets along with background layer
            if(win.g5.rb4.value) //Save all layerSets
            {
                for(var g =0; g<LSets; g++)
                {
                    activeDocument.activeLayer = activeDocument.layerSets[g];
                    var lName = activeDocument.activeLayer.name;
                    var saveFile= File(outputFolder+ "/" + getName(g,lName));
                    dupLayers();
                    if(win.g12.cb1.value)
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
            if(win.g5.rb5.value) //Save all layerSets along with the top layer
            {
                activeDocument.activeLayer = activeDocument.layers[0];
                var TopIDX =getSelectedLayersIdx();
                for(var g =0; g<LSets; g++)
                {
                    activeDocument.activeLayer = activeDocument.layerSets[g];
                    var lName = activeDocument.activeLayer.name;
                    selectLayerByIndex(Number(TopIDX[0]),true);
                    var saveFile= File(outputFolder+ "/" + getName(g,lName));
                    dupLayers();
                    if(win.g12.cb1.value)
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
            }//End Save all layerSets along with the top layer
            if(win.g5.rb6.value) //Save all layerSets along with background layer
            {
                for(var g =0; g<LSets; g++)
                {
                    activeDocument.activeLayer = activeDocument.layerSets[g];
                    var lName = activeDocument.activeLayer.name;
                    selectLayerByIndex(0,true);
                    var saveFile= File(outputFolder+ "/" + getName(g,lName));
                    dupLayers();
                    if(win.g12.cb1.value)
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
            }//End Save all layerSets along with background layer
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



        if(win.g12.cb3.value)
        {

            switch(Number(win.g18.dd1.selection.index))
            {
            case 0 :
                SavePNG(File(saveFile+"-hd.png"));
                break;
            case 1:
                SavePSD(File(saveFile+".psd"));
                break;
            case 2:
                SavePDF(File(saveFile+".pdf"));
                break;
            case 3:
                SaveTIFF(File(saveFile+".tif"));
                break;
            case 3:
                SaveJPG(File(saveFile+"-hd.jpg"),8);
                break;
            default :
                break;
            }


            width =  activeDocument.width / 2;
            height = activeDocument.height / 2;

            activeDocument.resizeImage(width,height,null,ResampleMethod.BICUBIC);
        }

        switch(Number(win.g18.dd1.selection.index))
        {
        case 0 :
            SavePNG(File(saveFile+".png"));
            break;
        case 1:
            SavePSD(File(saveFile+".psd"));
            break;
        case 2:
            SavePDF(File(saveFile+".pdf"));
            break;
        case 3:
            SaveTIFF(File(saveFile+".tif"));
            break;
        case 3:
            SaveJPG(File(saveFile+".jpg"),8);
            break;
        default :
            break;
        }
    }
}
main();
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
