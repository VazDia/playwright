/**
 * @desc Accepter une demande d'alignement
 * 
 * @author SIAKA KONE
 *  Since 2024-04-17
 */

const xRefTest      = "PRI_ALI_REF";
const xDescription  = "Refuser une demande d'alignement";
const xIdTest       =  4834;
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

import { AlignementsPage }      from '@pom/PRI/alignements.page';
import { MenuPricing }          from '@pom/PRI/menu.page.js';
import { CartoucheInfo, TypeEsb } from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;
let esb         : EsbFunctions;

let pageAlign   : AlignementsPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const sRayon    = fonction.getInitParam('rayon','Poissonnerie');

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    esb         = new EsbFunctions(fonction);
    menuPage    = new MenuPricing(page, fonction);
    pageAlign   = new AlignementsPage(page);
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

    test.describe('Page [ALIGNEMENTS]', async () => {    

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        });

        test('Page [ALIGNEMENTS] - Click', async () => {
            await menuPage.click('alignements',page);
        });

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });
        
        test('Date Picker [NEXT MONTH][LAST DAY] - Click', () => {
            fonction.clickElement(pageAlign.datePickerAlignementRecus);
            fonction.clickElement(pageAlign.datePickerNextMonth);
            fonction.clickElement(pageAlign.datePickerAvailableDay.last());
        });

        test('CheckBox [LISTE MAGASIN][0] - Check', async () => {
            await fonction.wait(page, 10000);
            const bEnable:Boolean = await pageAlign.checkBoxMagasin.first().isEnabled();
            if(bEnable) {
                await fonction.clickElement(pageAlign.checkBoxMagasin.first());
            }
        });

        test('Pictograme [REFUSER] - Click', async () => {
            await pageAlign.tdColActionDdeAlign.first().hover();
            await fonction.clickAndWait(pageAlign.pictogramRefuser.first(), page);
        });  

    })  //-- End Describe Page

    test.describe('Check Flux', async () => {   

        test('** CHECK FLUX **', async () =>  {

            var maDate  = new Date();
            var sDate   = fonction.addZero(maDate.getDate() + '/' + fonction.addZero(maDate.getMonth() + 1) + '/' + maDate.getFullYear());

            const oFlux:TypeEsb = { 
                FLUX : [
                    {
                        NOM_FLUX    : 'EnvoyerTarif_Mag',
                        TITRE       : 'Tarif du ' + sDate + ' magasin'
                    },
                    {
                        NOM_FLUX    : 'RepondreDemandeChangementPrix_Mag',
                        TITRE       : 'Répondre alignement'
                    },
                    {
                        NOM_FLUX    : 'EnvoyerTarifMagasin_Prefac',
                        TITRE       : 'Tarif du ' + sDate + ' magasin'
                    }
                ],
                                
                WAIT_BEFORE     : 30000,            // Optionnel
                VERBOSE_MOD     : false             // Optionnel car écrasé globalement
            };

            await esb.checkFlux(oFlux, page);

        });

    });

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})