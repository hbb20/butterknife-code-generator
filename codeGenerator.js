var textAreaInput;
var views;

/*This will set initial value for input and set output for the same. 
It sets event listener to inputArea so that on every change in inputText will regenerate output.
Then it focuses on inputArea so user can directly paste it with out additional click*/
function init() {
 textAreaInput=document.getElementById("textAreaInput");
 textAreaInput.value="<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<RelativeLayout xmlns:android=\"http://schemas.android.com/apk/res/android\"\n    xmlns:tools=\"http://schemas.android.com/tools\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\">\n\n    <LinearLayout\n        android:id=\"@+id/linear_parent\"\n        android:layout_width=\"match_parent\"\n        android:layout_height=\"match_parent\"\n        android:orientation=\"vertical\">\n\n       <EditText\n                    android:id=\"@+id/edittext_userName\"\n                    android:layout_width=\"match_parent\"\n                    android:layout_height=\"wrap_content\"/>\n\n        <EditText\n                    android:id=\"@+id/edittext_password\"\n                    android:layout_width=\"match_parent\"\n                    android:layout_height=\"wrap_content\"/>\n\n        <Button\n                android:id=\"@+id/button_login\"\n                android:layout_width=\"match_parent\"\n                android:layout_height=\"wrap_content\"/>\n</RelativeLayout>\n";
 textAreaInput.addEventListener("input", updateOutput, false);
 updateOutput();
 textAreaInput.focus();
}

/*This will process on inputText and puts according output in output area.
*/
function updateOutput() {
  // initialize views array
  views=new Array();

  // checks inputText and fill views array
  readAllViews();


  // final output variable
  var finalResult="";

  //when atleast 1 view with android:id is found, appends output of each single view to finalresult
  if(views.length!=0){
    finalResult="/**ButterKnife code begin**/ ";
    for (var i = 0; i < views.length; i++) {
      var view=views[i];
      var singleOutPut=getOutputLineForOneView(view);
      finalResult=finalResult+"\n"+singleOutPut;
    }
    finalResult=finalResult+"\n\n/**ButterKnife code end **/ \n"
  }else{
    finalResult="/**No view found**/ ";
  }
  
  //sets final result to output
  document.getElementById("textAreaOutput").value=finalResult;

  //sets foucus on output and select entire text of output. Now developer is only cltr + c press ways from copy the code.
  document.getElementById("textAreaOutput").focus();
}


/*This will find each and every view from input text
  if the view has 'android:id=' then that view will be added to views*/
function readAllViews() {
  var xmlText=textAreaInput.value;
  var lastViewEnd=-1;
  while(lastViewEnd<=xmlText.length){
    if(xmlText.indexOf("<",lastViewEnd+1)>-1){
      var viewBeginIndex=xmlText.indexOf("<",lastViewEnd+1);
      var viewEndIndex=xmlText.indexOf(">",viewBeginIndex);
      if(viewBeginIndex>-1 && viewEndIndex >-1){
        var view=xmlText.substring(viewBeginIndex,viewEndIndex+1);
        if(isEligibleView(view)){
            views.push(view);
        }
        lastViewEnd=viewEndIndex;  
      }
      else{
        break;
      }
    }else{
      break;
    }
  }
}


/*If view has "android:id" and className and id are not of length 0 then retun true or false otherwise.*/
function isEligibleView(view) {
  if(view.indexOf("android:id=")>-1){
    if(getClassNameForView(view).trim().length>0 && getIdFromView(view).trim().length>0){
      console.log("Eligibility: true=>"+view);
      return true;
    }else{
      console.log("Eligibility: false=>"+view);
      return false;
    }
  }
  else{
    console.log("Eligibility noID: false=>"+view);
    return false;
  }
}


/*
Returns output for single view.
this is sample oneViewXml
  <Button
    android:id="@+id/loginButton"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"/>
  
  output will be=>
    @Bind(R.id.loginButton) 
    Button loginButton;

*/
function getOutputLineForOneView(oneViewXml) {
    return "\n@Bind(R.id."+getIdFromView(oneViewXml).trim()+") \n"
            +getClassNameForView(oneViewXml).trim()+" "+getJavaNameForView(oneViewXml).trim()+";";
  }


/*this will return class name from xml view
sample view
<Button
  android:id="@+id/loginButton"
  android:layout_width="match_parent"
  android:layout_height="wrap_content"/>

returns=>
"Button"

*/
function getClassNameForView(oneViewXml){
  var output;
    var firstAngularIndex=oneViewXml.indexOf("<");
    if(firstAngularIndex>-1){
      var firstSpaceIndex=oneViewXml.indexOf(" ",firstAngularIndex);
      output=oneViewXml.substring(firstAngularIndex+1,firstSpaceIndex);
      return output;
    }
    return "Object";
}


/*this will return ID from xml view
sample view
<Button
  android:id="@+id/login_button"
  android:layout_width="match_parent"
  android:layout_height="wrap_content"/>

returns=>
"login_button"
*/
function getIdFromView(oneViewXml){
   if(oneViewXml.indexOf("android:id=")>-1){
  var lineBegin=oneViewXml.indexOf("android:id=");
  var lineFirstComma=oneViewXml.indexOf('/',lineBegin);
  var lineLastComma=oneViewXml.indexOf('"',lineFirstComma+1);
  var outPut=lineBegin+":linebegin  " +lineFirstComma+":lineFirstComma  "+lineLastComma+":lineLastComma";
  outPut=oneViewXml.substring(lineFirstComma+1,lineLastComma);
  return outPut;
  }else{
    return "";
  }
}

/*this will return javaname from xml view
sample view
<Button
  android:id="@+id/login_button"
  android:layout_width="match_parent"
  android:layout_height="wrap_content"/>

returns=>
"loginButton"
*/
function getJavaNameForView(oneViewXml){
  var xmlId=getIdFromView(oneViewXml).trim();

  var javaName="";
  var underScoreIndex=xmlId.indexOf("_");

  if(underScoreIndex==-1){ //no '_' in id then use id as name
      javaName=xmlId;
  }else{
    var tokens=xmlId.split("_");
    for (var i = 0; i < tokens.length; i++) {
      var token=tokens[i].trim();
      if(token.length>0){
        var firstChar=token.charAt(0);
        var capToken="";
        if(javaName.length==0){
          capToken=token;
        }else{
          capToken=firstChar.toUpperCase()+token.slice(1);
        }

        javaName=javaName+capToken;
      }
    }
  }
  return javaName;
}
