/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-09
 */

const xRefTest      = "MAG_PRI_CON";
const xDescription  = "Effectuer une concurence";
const xIdTest       =  299;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville','groupeArticle', 'idArticle'],
    fileName    : __filename
};

//-------------------------------------------------------------------------------------

import { test, type Page }          from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';
import { EsbFunctions }             from '@helpers/esb';

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { PrixGestion }              from '@pom/MAG/prix-gestion.page';

import { AutoComplete, CartoucheInfo, TypeEsb }   from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pagePrix            : PrixGestion;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

const sNomVille         = fonction.getInitParam('ville', 'Tours (G182)');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Marée'); 
const sArticle          = fonction.getInitParam('idArticle', 'M020'); 
const sNomEnseigne      = 'TA_align-concurrence Enseigne ' + sGroupeArticle + ' ' + sArticle + ' ' + fonction.getToday();

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pagePrix        = new PrixGestion(page);
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    let bValide:boolean=true;
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [PRIX]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if(isVisible){
                    await menu.removeArlerteMessage();
                }else{
                    log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })
        })

        var sNomPage = 'prix';

        test ('Page [PRIX] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () => {
            await menu.selectVille(sNomVille, page);
        })
        
        test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        }) 
        
        test ('ListBox [GROUPE] = "' + sGroupeArticle + '"', async() => {
            await pagePrix.listBoxGrpArticle.selectOption(sGroupeArticle);
        })

        test ('Button [CONCURRENCE] - Click', async () => {
            await fonction.clickElement(pagePrix.buttonConcurrence);
        })

        var sNomPopin = 'CHANGEMENT DE PRIX DE TYPE CONCURRENCE';
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

            let rNouveauPrix:number;

            test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la popin
                await fonction.isErrorDisplayed(false, page);
            }) 

            test ('InputField [ENSEIGNE CONCURRENTE] = "' + sNomEnseigne + '"', async () => {
                await fonction.sendKeys(pagePrix.pPinputNomEnseigne, sNomEnseigne);
            })

            test ('InputField [ARTICLE] = "1"', async () => {
                var oData:AutoComplete = {
                    libelle         :'ARTICLE',
                    inputLocator    : pagePrix.pPinputArticle,
                    inputValue      : sArticle,
                    //choiceSelector  :'button.dropdown-item',
                    //choicePosition  : 1,
                    selectRandom    : true,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    //verbose         : true,
                    page            : page,
                };
                await fonction.autoComplete(oData);
            })

            test ('Button [ + ] - Click', async () => {
                await fonction.clickAndWait(pagePrix.pPbuttonPlus, page);
                if (await pagePrix.pPoffreMessageErreur.isVisible()) {
                    bValide = false;
                    log.set('Message erreur : ' + await pagePrix.pPoffreMessageErreur.textContent());
                }
            })

            test ('InputField [NOUVEAU PVC] = "PVC Centrale - 0.01 €"', async() => {
                if (bValide) {
                    await pagePrix.pPinputNouveauPvc.waitFor();
                    const rAncienPrix = await pagePrix.pPinputPvcCentrale.inputValue();
                    rNouveauPrix = parseFloat(rAncienPrix.replace(',', '.')) - 0.01;
                    await fonction.sendKeys(pagePrix.pPinputNouveauPvc, rNouveauPrix.toFixed(2));
                } else {
                    test.skip();
                }
            })

            test ('Textarea [QUALITE] = "' + sNomEnseigne + '"', async() => {
                if (bValide) {
                    await fonction.sendKeys(pagePrix.pPinputQualite, sNomEnseigne, false);
                } else {
                    test.skip();
                }                    
            })

            test ('InputField [PVC ENSEIGNE] = "PVC Centrale - 0.01 €"', async() => {
                if (bValide) {
                    await pagePrix.pPinputPvcEnseigne.waitFor();
                    await fonction.sendKeys(pagePrix.pPinputPvcEnseigne, rNouveauPrix.toFixed(2));
                } else {
                    test.skip();
                }
            })

            test ('Button [ENREGISTRER] - Click', async () => {
                if (bValide) {
                    await fonction.clickAndWait(pagePrix.pPbuttonEnregistrer, page);
                } else {
                    test.skip();
                }
            })

            test ('Button [ANNULER] - Click (Optionnel)', async() => {
                if (bValide === false) {
                    await fonction.clickElement(pagePrix.pPbuttonFermer);
                } else {
                    test.skip();
                }
            })

        }); //-- Popin

    }); //-- Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test ('** CHECK FLUX **', async () => {

        if (bValide) {

            var oFlux:TypeEsb = { 
                "FLUX" : [
                    {
                            NOM_FLUX    : "Diffuser_TarifMagasin",
                            TITRE       : /Tarif du*/
                    },                      
                    {
                            NOM_FLUX    : "EnvoyerTarif_Mag",
                            TITRE       : /Tarif du*/
                    },                      
                    {
                            NOM_FLUX    : "EnvoyerTarifMagasin_Prefac",
                            TITRE       : /Tarif du*/
                    },                      
                    {
                            NOM_FLUX    : "Envoyer_Mail",
                            TITRE       : /Sujet : Demande d'alignement du magasin*/
                    },                      
                    {
                            NOM_FLUX    : "EnvoyerTarifMagasin_Relais",
                            TITRE       : /Tarif du*/
                    },                      
                ],
                WAIT_BEFORE  : 2000,               
                VERBOSE_MOD  : false
            };

            await esb.checkFlux(oFlux, page);

        } else {
            test.skip();
        }
        
     })

})