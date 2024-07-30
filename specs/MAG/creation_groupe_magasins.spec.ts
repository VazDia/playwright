/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 02 - 01 - 2024
 */

const xRefTest      = "MAG_GRP_MAG";
const xDescription  = "Création d'un groupe de magasins";
const xIdTest       =  1978;
const xVersion      = '3.3';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "../../utils/functions";
import { Log }                           from "../../utils/log";
import { Help }                          from '../../utils/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '../../pages/MAG/menu.page';
import { AutorisationsGroupeMagasins }   from '../../pages/MAG/autorisations-groupe_magasins.page';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageAutGrpMag   : AutorisationsGroupeMagasins;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var maDate              = new Date();
const sDesignation      = 'TEST-AUTO_Designation-' + maDate.getFullYear() + (maDate.getMonth() + 1) + maDate.getDate() + '_' + maDate.getHours() + maDate.getMinutes();
const iNbMagAssocier    = 10;

//---------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageAutGrpMag   = new AutorisationsGroupeMagasins(page);
})
 
test.afterAll(async () => {
    await fonction.close();
})

//-----------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.describe ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){

                await menu.removeArlerteMessage();
            }else{
                
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe('Page [AUTORISATIONS]', async () => {

        var pageName     = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName,page);
        })

        test('Onglet [GROUPES DE MAGASINS] - Click', async () => {
            await menu.clickOnglet(pageName, 'groupeMagasins', page);
        })

        test.describe ('Onglet [GROUPES DE MAGASINS]', async () => {

            test('Button [CREER UN GROUPE] - Click', async () => {                  
                await fonction.clickAndWait(pageAutGrpMag.buttonCreerGroupe, page);             
            })        

            var sNomPopin   = 'CREATION D\'UN GROUPE DE MAGASINS';
            test.describe ('Popin [' + sNomPopin + ']', async () => {

                test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })
                
                test('InputField [DESIGNATION] = "' + sDesignation + '"', async () => {
                    await fonction.sendKeys(pageAutGrpMag.pPinputDesignation, sDesignation);
                })
                
                test('ListBox [TYPE][4] - Select', async () => {
                    await pageAutGrpMag.pPlistBoxType.selectOption({index:3}); 
                })        

                test('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageAutGrpMag.pPbuttonEnregistrer, page);
                })

                test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            })  // End describe Popin

            test('CheckBox [GROUPE DE MAGASIN][0] - Click', async () =>{
                await fonction.clickElement(pageAutGrpMag.checkBoxGroupeMagasins.nth(0));
            })

            test('CheckBox [MAGASINS][rnd * ' + iNbMagAssocier + '] - Click', async () =>{
                test.setTimeout(90000);
                var iNbMag = await pageAutGrpMag.checkBoxListMagasins.count();
                for(var cpt=0; cpt < iNbMagAssocier; cpt++) {
                    var iCible    = (Math.floor(fonction.random() * iNbMag));
                    await pageAutGrpMag.checkBoxListMagasins.nth(iCible).scrollIntoViewIfNeeded();
                    var isVisible = await pageAutGrpMag.checkBoxListMagasins.nth(iCible).isVisible();
                    var isEnabled = await await pageAutGrpMag.checkBoxListMagasins.nth(iCible).isEnabled();
                    if(isEnabled && isVisible){
                        await fonction.clickElement(pageAutGrpMag.checkBoxListMagasins.nth(iCible));
                    }
                }
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageAutGrpMag.buttonEnregistrer, page);
            })
        })  // End describe onglet
    }) //End describe page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})