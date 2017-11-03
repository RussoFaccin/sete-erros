export class SeteErros{
  gameContainer: any;
  qtdErros: number;
  markIcon: string;
  markElement: string;
  markRadius: number;
  CANVAS_WIDTH: number;
  CANVAS_HEIGTH: number;
  REAL_WIDTH: number;
  REAL_HEIGHT: number;
  constructor(gameContainer: string, markIcon: string){
    this.gameContainer = document.querySelector("#"+gameContainer);
    this.markIcon = "img/"+markIcon;
    // this.markElement = `<div class="icon-match"><img src="${this.markIcon}"></div>`;

    // Bind
    this.handleMatch = this.handleMatch.bind(this);

    // Init
    this.init();
  }

  async init(){
    await this.getBlueprintSVG("blueprint.svg");

    this.getViewBox(this.gameContainer.querySelector("svg"));

    let targets = this.gameContainer.querySelectorAll("circle");
    this.qtdErros = targets.length;
    this.findTargets(targets);
  }
  
  getBlueprintSVG(fileName: string){
    let self = this;
    return new Promise((resolve, reject)=>{
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(this.responseText, "text/xml");
          let bluePrint = xmlDoc.querySelector("svg");
          self.gameContainer.appendChild(bluePrint);
          resolve();
        }
      };
      xhttp.open("GET", "img/"+fileName, true);
      xhttp.send();
    });
  }

  getViewBox(svgElement: any){
    this.CANVAS_WIDTH = svgElement.viewBox.baseVal.width;
    this.CANVAS_HEIGTH = svgElement.viewBox.baseVal.height;
  }

  findTargets(targets: any){
    targets.forEach(item=>{
      item.addEventListener("click", this.handleMatch)
    });
  }

  handleMatch(evt: any):any{
    let target = evt.target;
    let relX = (target.cx.baseVal.value / this.CANVAS_WIDTH) * 100;
    let relY = (target.cy.baseVal.value / this.CANVAS_HEIGTH) * 100;
    let markRadius = (target.r.baseVal.value / this.CANVAS_WIDTH) * 100;
    let markSize = ((target.r.baseVal.value * 2) / this.CANVAS_WIDTH) * 100;
    this.gameContainer.innerHTML += `<img class="icon-match" src="${this.markIcon}" width="${markSize}%" height="auto" style="left: ${relX}%; top: ${relY}%">`;
    evt.target.removeEventListener("click", this.handleMatch);
    this.qtdErros -= 1;
    this.checkVictory();
  }

  checkVictory(){
    if(this.qtdErros == 0){
      console.log("VICTORY");
      
    }
  }
}