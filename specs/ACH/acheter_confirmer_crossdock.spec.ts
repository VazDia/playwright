/**
 * @author SIAKA KONE
 * @desc Acheter & Confirmer un achat BCT / Saprimex (CrossDock)
 * @since 2024-04-30
 * 
 */
const xRefTest      = "ACH_CRD_AEC";
const xDescription  = "Acheter & Confirmer un achat BCT / Saprimex (CrossDock)";
const xIdTest       =  5165;
const xVersion      = '3.1';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACH',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['dossierAchat', 'plateforme','rayon','fournisseur'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { EsbFunctions }     from '@helpers/esb.js';
import { Log }              from '@helpers/log.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js'; 
import { PageAchCalApp }    from '@pom/ACH/achats_calendrier-approvisionnement.page';

import { CartoucheInfo, TypeEsb } from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;
let pageAchCalApp       : PageAchCalApp;
let esb             : EsbFunctions;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageAchCalApp       = new PageAchCalApp(page); 
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

const sDossierAchat = fonction.getInitParam('dossierAchat', 'Bcv - joubard julien');  //Anais chavanerin
const sPlateforme   = fonction.getInitParam('plateforme', 'Cremlog');      
const sRayon        = fonction.getInitParam('rayon', 'BCT');  
const sFournisseur  = fonction.getInitParam('fournisseur', 'Sas Les Ateliers Ⓔ');
//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {  
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACHATS]', async () => {

        var sNomPage:string = 'achats'; 

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })
        
        test('Page [ACHATS] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })

        test('Label [ERREUR] - Is Not Visible', async () => {     // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });
        
        test('ListBox [DOSSIER D\'ACHAT] = "' + sDossierAchat + '"', async() => {
            await fonction.listBoxByLabel(pageAchCalApp.listBoxDossierAchat, sDossierAchat, page);
        })

        test('DataGrid [PLATEFORME] = "' + sPlateforme + '"', async() => {            
            await fonction.clickAndWait(pageAchCalApp.tdListPlateformes.locator('span:text-is("' + sPlateforme + '")'), page);
            log.set('Plateforme sélectionnée : ' + sPlateforme);
        })

        test('Pictogram [BASCULER CROSSDOCKING] - Click', async() => {            
            await pageAchCalApp.tdListActionsSelected.hover();
            await fonction.clickAndWait(pageAchCalApp.pictoBasculerCrossDock, page);
        })

        test('DataGrid [FOURNISSEUR] = "' + sFournisseur + '"', async() => {
            await fonction.clickAndWait(pageAchCalApp.tdListFournisseurs.locator('span:text-is("' + sFournisseur + '")'), page);
            log.set('Plateforme sélectionnée : ' + sFournisseur);
        })

        test('InputField [ACHETE] = "' + 4 + '"', async() => {

            test.setTimeout(600000);
            const iNbChamps:number = await pageAchCalApp.inputQteAchetee.count();
            log.set('Nombre d\'articles : ' + iNbChamps);
            for(let iCpt = 1 ; iCpt < iNbChamps; iCpt++) {
                await pageAchCalApp.inputQteAchetee.nth(iCpt).scrollIntoViewIfNeeded();
                if( await pageAchCalApp.inputQteAchetee.nth(iCpt).isEnabled()) {
                    await fonction.sendKeys(pageAchCalApp.inputQteAchetee.nth(iCpt), '4');
                    break;
                }
            }
        })

        test('Button [ACHETER ET CONFIRMER] - Click', async () => {
            await fonction.clickAndWait(pageAchCalApp.buttonAcheterConfirmer, page);
        })

        var sNomPopin:string = "Date de récupération des PVC";
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () =>{

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }); 

            test ('Button [ENREGISTRER] - Click', async() => {
                test.setTimeout(60000);
                await fonction.clickAndWait(pageAchCalApp.pPiniButtonEnregistrer, page, 55000);
            })

            test.skip('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })
        })

    }) // end test.describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test('** CHECK FLUX **', async () => {
        var oFlux:TypeEsb = { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "EnvoyerLot_Prepa",
                    
                },
                {
                    "NOM_FLUX"  : "EnvoyerLot_Prefac",
                    
                },
                {
                    "NOM_FLUX"  : "EnvoyerLot_Stock",
                    
                },
                {
                    "NOM_FLUX"  : "EnvoyerLot_Repart",
                    
                },
                
            ],
            "WAIT_BEFORE"   : 10000,            // Optionnel    
        };

        await esb.checkFlux(oFlux, page);

    })

}) 