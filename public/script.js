
/**
 * Gets the URL of the current page without the path
 * @returns 
 */
function getBaseURL(){
    return(window.location.href.replace(window.location.pathname,'').replace(window.location.search,''));
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
/**
 * Identifies the user with an id and a type, possibly broken idk
 * @param {string} id 
 * @param {string} type 
 */
function mark(id,type) {
    alert(document.cookie);
    if(getCookie("id")==""){
        document.cookie = "id="+id+";"
    }
    if(getCookie("type")==""){
        document.cookie = "type="+type+";"
    }
    
}
