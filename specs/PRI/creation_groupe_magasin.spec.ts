/**
 * @desc Création d'un groupe de magasin
 * 
 * @author SIAKA KONE
 *  Since 2024-04-17
 */

const xRefTest      = "PRI_REF_GRP";
const xDescription  = "Création d'un groupe de magasin";
const xIdTest       =  352;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRI',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}       from '@playwright/test';

import { TestFunctions }        from "@helpers/functions";
import { Log }                  from "@helpers/log";
import { Help }                 from '@helpers/helpers';
import { EsbFunctions }         from '@helpers/esb';

import { GestionsMagasinPage }  from '@pom/PRI/gestions_magasins.page';
import { MenuPricing }          from '@pom/PRI/menu.page.js';
import { CartoucheInfo }        from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;
let esb         : EsbFunctions;

let pageGestMag : GestionsMagasinPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const sRayon    = fonction.getInitParam('rayon','Poissonnerie');

var maDate = new Date();

const sNomGrp       = 'TEST-AUTO_GrpMag-' + maDate.getFullYear() + (maDate.getMonth() + 1) + maDate.getDate() + '_' + maDate.getHours();
const sDescGrp      = 'TEST-AUTO_GrpMag-' + maDate.getFullYear() + (maDate.getMonth() + 1) + maDate.getDate() + '_' + maDate.getHours() + ' Descrptif';
const iCalculPvc    = 8;
const rMargePlate   = 8.8;
const rFraisLiv     = 8.88;

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    esb         = new EsbFunctions(fonction);
    menuPage    = new MenuPricing(page, fonction);
    pageGestMag = new GestionsMagasinPage(page);
    const helper = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async () => {
    await fonction.close();
});

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [GESTION DES MAGASINS]', async () => {    

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        });

        test('Onglet [GROUPE DE MAGASINS] - Click', async () => {
            await menuPage.click('gestion', page);
        });

        test('Button [CREER UN GROUPE DE MAGASIN] - Click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonCreerGroupeMagasin, page);
        });

        var sNomPopin:string = 'CREATION D\'UN GROUPE';

        test.describe('Popin [' + sNomPopin + ']', async () => {

            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }); 

            test('InputField [NOM] ="' + sNomGrp + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeNom, sNomGrp);
            });

            test('InputField [DESCRIPTION] ="' + sDescGrp + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeDescription, sDescGrp);
            });

            test('InputField [CALCUL PVC] ="' + iCalculPvc + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeTauxCalculPVC, iCalculPvc);
            });

            test('InputField [MARGE PLATEFORME] ="' + rMargePlate + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeMargePlateforme, rMargePlate);
            });

            test('InputField [FRAIS LIVRAISON] ="' + rFraisLiv + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeFraisLivraison, rFraisLiv);
            });

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageGestMag.pButtonGroupeEnregistrer, page);
            });

            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            }); 
        });

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });
    });  //-- End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})