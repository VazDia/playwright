/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 17 - 11 - 2023
 * 
 */

const xRefTest      = "STO_INV_PLF";
const xDescription  = "Faire un inventaire plateforme";
const xIdTest       =  262;
const xVersion      = '3.1';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}                from '@playwright/test';

import { TestFunctions }                         from "../../utils/functions";
import { Log }                                   from "../../utils/log";
import { Help }                                  from '../../utils/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                             from "../../pages/STO/menu.page";
import { InventaireInventaire }                  from '../../pages/STO/inventaire-inventaire.page';

//----------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuStock;
let pageInventaire   : InventaireInventaire;

const fonction       = new TestFunctions();
const log            = new Log();

//----------------------------------------------------------------------------------------


const iQtePalette   = 8;
const iNbTentatives = 10;

const plateforme    = process.env.PLATEFORME || 'Cremcentre';

//----------------------------------------------------------------------------------------

var checkConditions = async (iNbEssai:number) => {

    ++iNbEssai;
    log.set('-- Essai ' + iNbEssai + ' / ' + iNbTentatives + ' ----------------');

    if (iNbEssai >= iNbTentatives) {

        return 'Sortie de boucle pour éviter une boucle infinie...';
    } else {

        try {

            if(await pageInventaire.dataGridZoneLignes.first().isVisible()){

                var NbZones = await pageInventaire.dataGridZoneLignes.count()
                var rnd = Math.floor(fonction.random() * NbZones);
                log.set('Selection Zone : ' + rnd + '/' + NbZones);
                await fonction.clickAndWait(pageInventaire.dataGridZoneLignes.nth(rnd), page, 40000);
                if( await pageInventaire.dataGridEmplaceLignes.first().isVisible()){
    
                    var NbEmplacements = await pageInventaire.dataGridEmplaceLignes.count()
                    var rnd = Math.floor(fonction.random() * NbEmplacements);
                    log.set('Selection Emplacement : ' + rnd + '/' + NbEmplacements);
                    await fonction.clickAndWait(pageInventaire.dataGridEmplaceLignes.nth(rnd), page,  40000);
    
                    if (await pageInventaire.inputListQtePalette.first().isVisible()){
            
                        var iNbResponses = await pageInventaire.inputListQtePalette.count();
                        if(iNbResponses === 1){
    
                            var iNumPalette = await pageInventaire.tdListNumPalette.textContent();
                            log.set('Num Palette : ' + iNumPalette);
                            await fonction.sendKeys(pageInventaire.inputListQtePalette, iQtePalette.toString());
                            await fonction.clickAndWait(pageInventaire.buttonSauvegarder, page);
                            return;
                        }else{
    
                            var rnd = Math.floor(fonction.random() * iNbResponses);
                            log.set('Rnd : ' + rnd);
                            var iNumPalette = await pageInventaire.tdListNumPalette.nth(rnd).textContent();
                            log.set('Num Palette : ' + iNumPalette);
                            await fonction.sendKeys(pageInventaire.inputListQtePalette.nth(rnd), iQtePalette.toString());
                            await fonction.clickAndWait(pageInventaire.buttonSauvegarder, page);
                            return;
                        }
                    }else{
    
                        log.set('Pas de Palette trouvée pour cette configuration !');
                        log.set(' ');
                        await checkConditions(iNbEssai);
                    }
                } else {
    
                    log.set('Aucun Emplacement sélectionnable');
                    log.set(' ');
                    await checkConditions(iNbEssai);
                }
            }else {
    
                log.set('Aucune ligne existante dans la zone');
            }

        }catch(erreur){
            console.log(erreur)
        }
                        
    }
};

//----------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage(); 

    menu                = new MenuStock(page, fonction);
    pageInventaire      = new InventaireInventaire(page);
})

test.afterAll(async () => {
    await log.get();
})

//------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', () => {

    var iNbEssais = 0

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

    test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [INVENTAIRE]', () =>  {    

        var currentPage = 'inventaire';

        test('Page [INVENTAIRE] - Click', async () => {
            await menu.click(currentPage, page);  
        })

        test('** Traitement * ', async () => {
            test.setTimeout(120000);
            await checkConditions(iNbEssais);            
        });
             
        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        })

        test('Label [DERNIERE SAUVEGARDE SUR...] - Is Visible', async () => {
            if (iNbEssais >= iNbTentatives) {                            // On ignore ce test
                log.set('Contrôle Label Ignoré');
                test.skip()
            } else {
                expect(await pageInventaire.labelSaveConfirmation.isVisible()).toBe(true);
            }
        })
    })
})