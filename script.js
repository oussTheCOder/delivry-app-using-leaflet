
// 
const menuBtn=document.querySelector(".menu-btn");
const navigation=document.querySelector(".nav-list");
let menuOpen=false;
menuBtn.addEventListener("click",showNav);
/*



/*-------not done---------
3-complete calculate costs functionality.
    //1-create the form.done
    //2-styling the form.done

    ---complete the functionality of the form.???
       
        

    

*/
/*
4-complete all the functionalities concerning the map 
5-adding all the static content of the website.
6-responsiveness.
7-make it simple and to the point.
*/

function showNav(){
    navigation.classList.toggle("show");
    if(!menuOpen){
       menuBtn.classList.add("open");
       document.body.style.overflowY="hidden";
       menuOpen=true;
    }else{
        menuBtn.classList.remove("open");
        document.body.style.overflowY="visible";
        menuOpen=false;
    }
}
// remove the menu when clicking outside the ul list menu
navigation.addEventListener("click",hideNav);
function hideNav(event){
  let target=event.target;
  if(!target.closest(".nav-list.show ul")){
    menuBtn.classList.remove("open");
    navigation.classList.toggle("show");
    document.body.style.overflowY="visible";
    menuOpen=false;
  }
}

// slider
let slider = document.querySelector('.slider');
let slides = document.querySelectorAll('.slide');
let currentSlide = 0;
let slideInterval = setInterval(nextSlide,4000);

function nextSlide() {
  slides[currentSlide].classList.remove('active-slide');
  currentSlide = (currentSlide+1)%slides.length;
  slides[currentSlide].classList.add('active-slide');
}



// map 
const sectionHome=document.querySelector("section.home-page");
const sectionMap=document.querySelector("section.map");
const form=document.querySelector(".map-form");
const mapArea=document.querySelector(".map-area");
const boxStartingState=document.querySelector(".starting-state");
const boxEndingState=document.querySelector(".ending-state");
const boxConfirmDist=document.querySelector('.confirm-dist-state');
const btnCalculateCost=document.querySelector(".calculate_btn");
const boxCurrentPos=document.querySelector(".actual-pos_box");
const boxDefinePos=document.querySelector(".define-pos_box");
const suggestContainerParent=document.querySelector(".sugges-Contain-Parent");
const suggestionsContainer = document.querySelector(".suggested-pos");
const btnCloseForm=document.querySelector(".close-form");
const btnValidateStart=document.querySelector(".validate-start_btn");
const btnValidateEnd=document.querySelector(".validate-end_btn");
const btnConfirmDist=document.querySelector(".confirm-dist_btn")
const inputStartPos=document.querySelector(".select-pos_init");
const inputEndPos=document.querySelector(".select-pos_end");
let addressCity;
let addressDescr;
let address;
let markers=[];
let distinationCoords;
let latlngs=[];
let marker;

const hide=function(element){
    element.classList.add("hide");
    element.classList.remove("show");
}
const  appear=function(element){
    element.classList.remove("hide");
    element.classList.add("show");
}
btnCalculateCost.addEventListener("click",(event)=>{
    sectionMap.classList.add("show-map");
    appear(mapArea);
    // appear(form);
    inputStartPos.value="current position";
    // inputEndPos.focus();
})
btnValidateStart.addEventListener("click",(event)=>{
    hide(mapArea);
    hide(boxStartingState);
    appear(form);
})
window.addEventListener("load",function(){
if(navigator.geolocation){//if browser support geolocation
    navigator.geolocation.getCurrentPosition(//accept two callback functions
    function(position){//successful callback function has position as parameter
      console.log(position);//object contains info 
      const {latitude,longitude}=position.coords;//use destructuring to get latitude and longitude of your position
      const coords=[latitude,longitude];
      //creating a map object
      const map = L.map('myMap').setView(coords, 13);//myMap string is the is where we display our map
      //creating a layer object
      const layer=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
      //adding layer to the map object.
      layer.addTo(map);
      markers.push()
      console.log(markers)
      // Attach an event listener to the input field
          document.getElementById("autosuggestEnd").addEventListener("input", function(event) {
            let text = event.target.value;
            this.autocomplete="off";/*prevent the default dropDown of presvious typed options from appearing */
            getSuggestions(text);
          });
          document.getElementById("autosuggestStart").addEventListener("input",function(event){
            let text=event.target.value;
            getSuggestions(text);
          })

  async function getSuggestions(text) {
            let apiKey = "AAPKb9da5faa4a754be3a665b30b562013457R_KdFXzCJtmqTBVhWGEyR2YxR85JWZP18HULITIFqXw6Vu75TEC1ci3nmYYlK7e";
            let url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=${text}&f=json&apiKey=${apiKey}`;
            // Make a GET request to the ArcGIS Autosuggest endpoint
            try{
                const response=await fetch(url);
                const data=await response.json();
                // Display the suggestions
                suggestionsContainer.innerHTML="";
                const suggestedCityNames=data.suggestions.map(suggestion=>suggestion.text);
                suggestedCityNames.map((city)=>{
                  const suggestedItem=document.createElement("p");
                  suggestedItem.innerHTML=`<i class="fa-solid fa-location-dot"></i><p>${city}</p>`
                  suggestionsContainer.appendChild(suggestedItem);
                  })
              }catch(error)
              {console.log(`error fetching data:${error}`)}
            }
//geolocation using the nominatim--------------------------------------------------
  async function getPlaceName(fetchLat,fetchLong) {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${fetchLat}&lon=${fetchLong}`);
        const result=await response.json();
        const address=result.features[0].properties.address;
        const{neighbourhood,quarter,road,suburb,village,town,city,state}=address;
        addressDescr=neighbourhood||quarter||road||suburb||village||'unamed';
        addressCity=town||city||state||'unamed';  
      }
      
  async function createMarker (fetchLat,fetchLong){
        await getPlaceName(fetchLat,fetchLong);
        //create a marker
             //option of the marker
             const markerOptions={
               clickable: false,
               draggable: true
             }
             //creating a marker
             marker=L.marker([fetchLat,fetchLong],markerOptions);
               //adding a marker to map
               marker.addTo(map); 
             //adding a popUp to the marker
               //popUp options 
             const popUpOptions={
               className:"popup-style",
               closeOnClick:false,
               closeButton:false,
               autoClose:false,
               maxWidth:200,
             }
             marker.bindPopup(`${addressDescr}-${addressCity}`,popUpOptions).openPopup();
             markers.push(marker);
             markers.splice(1,markers.length-2);
             console.log(markers);

             const[marker1,marker2]=markers;
             latlngs=[marker1.getLatLng(),marker2?.getLatLng()||"not created yet"];
             console.log(marker2?.getLatLng()||"not created yet");
             const bounds=L.latLngBounds([marker1.getLatLng(),marker2?.getLatLng()]);
             map.fitBounds(bounds);
 }
 //get the place name and create a marker when the page is loaded
  getPlaceName(latitude,longitude);
  createMarker(latitude,longitude);

  async function getCoordsOfplace(placeName){
      let url=`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?text=" + ${placeName} + "&f=json`;
      const response=await fetch(url);
      const result=await response.json();
      const{x:lng,y:lat}=result.locations[0].feature.geometry;
      await createMarker(lat,lng);
    }

  //implement getting position from input place name how
  const handleSuggesClick=function(event){
    let target=event.target.closest(".suggested-pos p");
    if(!target) return;
    inputEndPos.value=target.textContent;
    suggestionsContainer.innerHTML="";
    getCoordsOfplace(target.textContent);
    appear(mapArea);
    hide(form);
    appear(boxConfirmDist)
  }
  suggestionsContainer.addEventListener("click",handleSuggesClick);

 let numClickEndPos=0; 
    const handleClickMap=function(mapEvent){//when click on the map execute this function
      if(boxDefinePos.classList.contains("start-pos")){
        map.removeLayer(marker);//remove the previous marker
          markers.pop();
          const{lat,lng}=mapEvent.latlng;//get the current latitude and longitude
          getPlaceName(lat,lng);
          createMarker(lat,lng);
      }else{
        numClickEndPos++;
        if(numClickEndPos>1){
          map.removeLayer(marker);//remove the previous marker 
          // markers.pop();
        }
        const{lat,lng}=mapEvent.latlng;//get the current latitude and longitude
        getPlaceName(lat,lng);
        createMarker(lat,lng);
        console.log(markers);
      }
    }
    // ----------------------------------------------------------------
    const handleBoxCurrentPosClick=function(event){
      inputStartPos.value="current position";
      inputEndPos.focus();
    } 
    const handleBoxDefineClick=function(event){
        hide(form);
        appear(mapArea);
        if(boxDefinePos.classList.contains("start-pos")){
          appear(boxStartingState);
          hide(boxEndingState);
        }else{
          hide(boxStartingState);
          appear(boxEndingState);
        }
      }
      // -----------------------------------------------------------------
      const handleValidateStart=function(){
            boxDefinePos.classList.remove("start-pos");
            inputStartPos.value=`${addressDescr}-${addressCity}`;
            inputEndPos.focus();
            console.log('******************************************************');    
      }
      const handleValidateEnd=function(){
           inputEndPos.value=`${addressDescr}-${addressCity}`;
           hide(boxEndingState);
           appear(boxConfirmDist);
           console.log("mesure the distance between the starting and the ending point");
           let polyline = L.polyline(latlngs, {color: '#0081B4'}).addTo(map);
           //fit the map view to fit the both markers
           let bounds=L.latLngBounds(latlngs);
           map.fitBounds(bounds);
           // zoom the map to the polyline
           map.fitBounds(polyline.getBounds());
           map.off("click",handleClickMap);
      }
      const handleConfirmDist=function(){
          hide(boxConfirmDist);
      }
      //handle all the events when the user click on the inputStartPos------
      inputStartPos.addEventListener("focus",(event)=>{
          boxCurrentPos.addEventListener("click",handleBoxCurrentPosClick);
          boxDefinePos.classList.add("start-pos");
          boxDefinePos.addEventListener("click",handleBoxDefineClick);
          map.on("click",handleClickMap);
          btnValidateStart.addEventListener("click",handleValidateStart);
        })
      btnValidateEnd.addEventListener("click",handleValidateEnd);
      btnConfirmDist.addEventListener("click",handleConfirmDist);

      //handle all events when the user click on inputEndPos...
      inputEndPos.addEventListener("focus",(event)=>{
        boxDefinePos.classList.remove("start-pos");
        appear(suggestContainerParent);
        boxCurrentPos.removeEventListener("click",handleBoxCurrentPosClick);
        boxDefinePos.addEventListener("click",handleBoxDefineClick);
        map.on("click",handleClickMap);
      })
      inputEndPos.addEventListener("blur",(e)=>{
        hide(suggestContainerParent);
      })

      btnCloseForm.addEventListener("click",(event)=>{
        sectionMap.classList.remove("show-map");
        map.off("click",handleClickMap);
      })

    }      ,
    //error callback function to handle errors 
    function(){
      console.log("can't access your position");
    }
    )}
  })

  

