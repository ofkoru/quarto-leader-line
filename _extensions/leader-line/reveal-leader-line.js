window.RevealLeaderline = function () {
  return {
    id: "RevealLeaderline",
    init: function (deck) {
      revealleaderlineinit(deck);
    },
  };
};

var leaderline_vector = [];


function revealleaderlineinit(Reveal){
  var leaderline_default_values ={
  drawEffect: 'none',
  animateDuration: 1000,
  color:"orange",
  labelPosition:"middle",
  endSocket:"auto",
  startSocket:"auto"
}

// convert integers to number
function convertIntObj(obj) {
  const res = {}
  for (const key in obj) {
    res[key] = {};
      const parsed = parseFloat(obj[key]);
      res[key] = isNaN(parsed) ? obj[key] : parsed;
    }

  return res;
}

function convertToCamelCase(inputString) {
    return inputString.split('-')
        .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

function convertAttributesToData(element) {
  // Iterate over the attributes of the element
  for (let i = element.attributes.length-1; i >= 0; i--) {
    let attr = element.attributes[i];
    // Skip class and id attributes
    if (attr.name === 'class' || attr.name === 'id' || Object.keys(element.dataset).includes(attr.name)) {
      continue;
    }
    // Check if the attribute name doesn't start with 'data-'
    if (!attr.name.startsWith('data-')) {
      // If not, convert it to a 'data-' attribute
      var name = convertToCamelCase(attr.name);
      element.dataset[name] = attr.value;
      // Remove the original attribute
      element.removeAttribute(attr.name);
    }
  }
  
}


// parse style
function parseStyle(style){
  let output = {};
  style = style.trim();
  style.split(';').forEach( s =>{
    let parts = s.split(':');
    if(parts.length===2){
      parts[1] = parts[1].trim();
      if(/^\d+$/.test(parts[1])){
        output[parts[0].trim()] = Number.isInteger(parts[1]) ? parseInt(parts[1]) : parseFloat(parts[1]);
      } else{
        output[parts[0].trim()] = parts[1];
      }
    }
  })
  return output;
}

function retrieveBorder(df, type="start"){
  if (typeof df[type] === 'object'){
    var dom = df[type];
  } else{
    var dom = document.querySelector(df[type]);
  }
  
  if(df[type + "BorderStyle"] !==undefined){
    df[type+"Border"] = "true";
    var out = LeaderLine.areaAnchor( dom,
                        parseStyle(df[type + "BorderStyle"] ));
  } else if(df[type + "Border"]=="true"){
    var out = LeaderLine.areaAnchor(dom);
  } else{
    var out = dom;
  }
  
  return (out)
}


function findSlideId( element ){
  var ind= false;
  var parent = element.parentNode;
  while(!ind){
    if (parent.tagName=="SECTION"){
      ind=true;
    } else{
      parent = parent.parentNode;
    }
    
    
  }
  return(parent.id)
}

function addText(df, line){
  if(!["start","middle","end"].includes(df.labelPosition)){
    df.labelPosition = "middle";
  }
  

  ["path", "caption"].forEach(type =>
    {
      if (df[type + "Label"]!== undefined){
        if(df["labelStyle"]!==undefined){
          line[df.labelPosition +"Label"]=LeaderLine[type+"Label"](df[type+"Label"] +"", parseStyle(df.labelStyle) );
        } else{
          line[df.labelPosition +"Label"]=LeaderLine[type+"Label"](df[type+"Label"] +"");
        }
      }
    }
  
  )
  return(line)
}



function updateLine(line, updates){
   var oldAtt = {};
  var df= convertIntObj(updates.dataset);
  for(key in line){
    if(typeof line[key]!== 'function'){
      oldAtt[key] = line[key];
      if (df[key]=== undefined){
        df[key] = line[key];
      }
    }
  }
  var start = retrieveBorder(df, "start");
  var end = retrieveBorder(df, "end");
  oldAtt.fragment= updates.dataset.fragmentIndex;
  oldAtt.start = line.start;
  oldAtt.end = line.end;
  leaderline_attributes_history[line.lineid].push(oldAtt);
  line.setOptions(convertIntObj(updates.dataset));
  line.start  =start;
  line.end  =end;
  addText(df,line);
  if (df.action=="hide"){
    line.hide();
  } else if(df.action=="show"){
    line.show();
  }
}

// get leaderLine lines
var leaderlineSpans = document.querySelectorAll("span.leaderline:not(.setAttribute)");
leaderlineSpans.forEach( d=>{
   convertAttributesToData(d);
   d.dataset.slideId = findSlideId(d);
   d.dataset.start = "#" + d.dataset.slideId + " " + d.dataset.start;
   d.dataset.end = "#" + d.dataset.slideId + " " + d.dataset.end;
   if(d.dataset.lineid !==undefined)  {d.dataset.lineid = d.dataset.slideId +"_" + d.dataset.lineid;}
  for( key in leaderline_default_values){
    if(d.dataset[key]===undefined){
      d.dataset[key] = leaderline_default_values[key];
    }
  }
})

var leaderlineSetAttribute = document.querySelectorAll("span.leaderline.setAttribute");
leaderlineSetAttribute.forEach(d=>    {
  convertAttributesToData(d);
  d.dataset.slideId =  findSlideId(d);
  if(d.dataset.lineid !==undefined)  {d.dataset.lineid = d.dataset.slideId +"_" + d.dataset.lineid;}
  if (d.dataset.start!==undefined){
    d.dataset.start = "#" + d.dataset.slideId + " " + d.dataset.start;
  }
  if( d.dataset.end !== undefined){
    d.dataset.end = "#" + d.dataset.slideId + " " + d.dataset.end;
  }
});


// add fragment class if it is missing but index is defined
document.querySelectorAll("span.leaderline:not(.fragment)[data-index]").forEach(d=> d.classList.add("fragment"));

var leaderline_attributes_history = [];


//Reveal.on('ready', function(){
window.addEventListener('load', function() { 
  
  // match parent's fragment if it is not defined
    document.querySelectorAll(" .fragment:has(.leaderline:not(.fragment)").forEach(d=>
          d.querySelectorAll(".leaderline:not(.fragment)").forEach(dd=> {
            dd.classList.add("fragment");
            dd.dataset.fragmentIndex=d.dataset.fragmentIndex;
            dd.dataset.index=dd.dataset.fragmentIndex;
          }));
  
  leaderlineSetAttribute.forEach(d=>    d.dataset.fragmentIndex= d.dataset.index);

  
  leaderlineSpans.forEach(d=>{
    
    // correct fragment indexation
    d.dataset.fragmentIndex= d.dataset.index;
    // convert integers to numbers
    df= convertIntObj(d.dataset);
    
    var start = retrieveBorder(df, "start");
    var end = retrieveBorder(df, "end");
    
    // generate a new line
    var line = new LeaderLine(
          start = start,
          end = end
          );
    
    // set options
    line.setOptions(df);
    addText(df,line);
    d.setAttribute("data-line-index", line._id);
    if(df.lineid!==undefined){
      line.lineid=df.lineid;
      leaderline_attributes_history[df.lineid] = [];
    }
    if( df.link!=undefined ){
      var linkedObj = document.querySelector(df.link);
      if(linkedObj.classList.contains("fragment")){
        d.dataset.fragmentIndex =linkedObj.dataset.fragmentIndex;
        d.classList.add("fragment");
      }
      
    }
    
    leaderline_vector.push(line);
    }
  )
  
  
  // hide all lines
    leaderline_vector.forEach(d=> d.hide('none'));
    // only show current lines on current slide
    slideLines = Reveal.getCurrentSlide().querySelectorAll("span.leaderline:not(.setAttribute, .fragment)" + 
      ", span.leaderline.fragment.visible:not(.setAttribute)");
    slideLines.forEach( d=> {
      leaderline_vector[d.dataset.lineIndex-1].show();
    })
    
    // z index of lines
    document.querySelectorAll("svg.leader-line, svg.leader-line-areaAnchor").forEach(
      d=> d.style.zIndex=100
    )
    
    
    
  /// sync with REVEAL
  Reveal.on("slidechanged", event=> {
      leaderline_vector.forEach(d=> d.position());

    slideLines = Reveal.getCurrentSlide().querySelectorAll("span.leaderline:not(.setAttribute, .fragment)" + 
      ", span.leaderline.fragment.visible:not(.setAttribute)");
    slideLines.forEach( d=> {
      leaderline_vector[d.dataset.lineIndex-1].show(d.dataset.drawEffect, {duration: d.dataset.animateDuration});
    })
    slideLinesB = event.previousSlide.querySelectorAll(".leaderline:not(.setAttribute)")
    slideLinesB.forEach( d=> {
      leaderline_vector[d.dataset.lineIndex-1].hide('none');
    })
    
    if (Reveal.getCurrentSlide().querySelectorAll(".fragment.visible").length>0){
      var s = Reveal.getCurrentSlide().querySelectorAll("span.leaderline:not(.setAttribute)[data-lineid]");
      s.forEach(ss=>{
          var atts = Reveal.getCurrentSlide().querySelectorAll(".leaderline.setAttribute[data-lineid='" + ss                        .dataset.lineid + "']");
        var line = leaderline_vector[ss.dataset.lineIndex-1];
        leaderline_attributes_history[line.lineid] =[];
        updateLine(line, ss);
        atts.forEach(fragment =>{
            updateLine(line, fragment)
        })
        
      })
    }
        
    
  }
  )
  
  Reveal.on("fragmentshown", event=> {
      var currIndex = Reveal.getCurrentSlide().dataset.fragment;
      var fragmentLines = Reveal.getCurrentSlide().querySelectorAll("span.leaderline:not(.setAttribute)[data-fragment-index='" + currIndex +"']");
      fragmentLines.forEach(d=>{
        leaderline_vector[d.dataset.lineIndex - 1].show(d.dataset.drawEffect, {duration: d.dataset.animateDuration});
      });
      
      event.fragments.forEach((fragment) => {
        if (fragment.classList.contains("leaderline") & fragment.classList.contains("setAttribute") ) {
            var line = leaderline_vector.find(d=> d.lineid==fragment.dataset.lineid);
            updateLine(line, fragment);
            if (fragment.dataset.action=="hide"){
              line.hide();
            } else if(fragment.dataset.action=="show"){
              line.show();
            } 
          }
        });
    
      }
  )
  
  
  Reveal.on("fragmenthidden", event=> {
    a = event;
    var perIndex = parseInt(Reveal.getCurrentSlide().dataset.fragment)+1;
    var fragmentLines = Reveal.getCurrentSlide().querySelectorAll("span.leaderline:not(.setAttribute)[data-fragment-index='" + perIndex +"']");
    fragmentLines.forEach(d=>{
      leaderline_vector[d.dataset.lineIndex - 1].hide();
    });
    
    
    event.fragments.forEach((fragment) => {
      if (fragment.classList.contains("leaderline") & fragment.classList.contains("setAttribute") ) {
        var line = leaderline_vector.find(d=> d.lineid==fragment.dataset.lineid);
        var oldAtt = leaderline_attributes_history[line.lineid][leaderline_attributes_history[line.lineid].length-1];
        line.setOptions(convertIntObj(oldAtt)  );
        line.start = oldAtt.start;
        line.end = oldAtt.end;
        addText(oldAtt,line);
        leaderline_attributes_history[line.lineid].pop();
        if (fragment.dataset.action=="hide"){
              line.show();
        } else if(fragment.dataset.action=="show"){
          line.hide();
        }
      } 
    });
  }
  )
        
        
        
  
  // Add event listeners for beforeprint and afterprint events
  window.matchMedia('print').addListener(function(media) {
    if (media.matches) {
      var event = new Event('resize');
      window.dispatchEvent(event);
      leaderline_vector.forEach(d=> d.show());
    } 
  });
  
  Reveal.on( 'resize', event => {
      leaderline_vector.forEach(d=> d.position());
  } );
  
})


  
}