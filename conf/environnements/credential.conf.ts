export class Credential {

    private datas           : any
    private aRolesProfils   : any
    private codesArticle    : any

  // -------------------------------------------------------------------------------------
  
    constructor(private profil: string = 'lunettes') {

      this.datas = {
        'chaussure'   : 'Prosol69',
        'chaussette'  : 'sock',
        'veste'       : 'Azer1234',
        'lunettes'    : 'glasses',
        'jcc-recette1': 'Prosol69!',
        'jcc-recette2': 'Prosol69!',
        'jcc-recette3': 'Prosol69!',
        'jcc-recette4': 'Prosol69!',
        'jcc-recette5': 'Prosol69!',
        'jcc-recette6': 'Prosol69!',
        'jcc-recette7': 'Prosol69!',
        'jcc-recette8': 'Prosol69!',
        'jcc-recette9': 'Prosol69!',
        'jcc-recette10': 'Prosol69!',
        'jcc-recette11': 'Prosol69!',
        // ... autres données ...
      };
    
      this.aRolesProfils = {
        MAGASIN: {
          'ADMIN METIER'  : 'jcc-recette1',
          'PILOTE ALERTE' : 'jcc-recette7',
          'COMPTABILITE FISCALE':'jcc-recette3',
          'RESPONSABLE DE RAYON': 'jcc-recette9',
          // ... autres rôles ...
        },
        // ... autres applications ...
      };
    
      this.codesArticle = {
        FL: [5300, 5070],
        FD: [4008],
      };
    }

  // -------------------------------------------------------------------------------------
    public getData() {
      if (this.datas[this.profil] !== undefined) {
        const credential = {
          login: this.profil,
          password: this.datas[this.profil],
        };
        return credential;
      } else {
        throw new Error('JCC : USER [ ' + this.profil + ' ] Inconnu');
      }
    }
  
    public getProfil(appli: string, role: string) {
      if (this.aRolesProfils[appli][role] !== undefined) {
        const credential = {
          login: this.aRolesProfils[appli][role],
          password: this.datas[this.aRolesProfils[appli][role]],
        };
        return credential;
      } else {
        throw new Error('JCC : ROLE [ ' + appli + ' | ' + role + ' ] Inconnu');
      }
    }
  
    public getUrlAppli(environnement: string, application: string) {
      var url:any
      if (url.environnement.application !== undefined) {
        return url.environnement.application;
      } else {
        throw new Error('JCC : URL [ ' + environnement + ' / ' + application + ' ] Inconnue');
      }
    }
  
    public getUrWslVersion() {
      var url:any
      return url.version;
    }
  
    public getCodesArticle(groupeArticle: string = 'FL') {
      if (groupeArticle !== undefined) {
        if (this.codesArticle[groupeArticle] !== undefined) {
          return this.codesArticle[groupeArticle];
        } else {
          throw new Error('JCC : Groupe Article [ ' + groupeArticle + ' ] Inconnu');
        }
      } else {
        return this.codesArticle;
      }
    }
  }