/**
 * 
 * @desc Créer un don
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 13 - 11 - 2023
 */

const xRefTest      = "STO_DON_IRE";
const xDescription  = "Imprimer un reçu";
const xIdTest       =  1890;
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

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "../../utils/functions";
import { Log }                           from "../../utils/log";
import { Help }                          from '../../utils/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                     from "../../pages/STO/menu.page";
import { StockDons }                     from "../../pages/STO/stock-dons.page";

//----------------------------------------------------------------------------------------

let page        : Page;

let menu        : MenuStock;
let pageDon     : StockDons;

const fonction  = new TestFunctions();
const log       = new Log();

//----------------------------------------------------------------------------------------

const plateforme  = process.env.PLATEFORME || 'Cremcentre';

//----------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });
test.beforeAll(async ({ browser }) => {
    page      = await browser.newPage(); 

    menu      = new MenuStock(page, fonction);
    pageDon   = new StockDons(page);
});

test.describe ('[' + xRefTest + '] - ' + xDescription + ' : ', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        fonction.setTartTime(testInfo);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [STOCK]', async () => {    

        var currentPage  = 'stock';

        test('Page [STOCK] - Click', async () => {
            await menu.click(currentPage, page); 
        })

        test.describe('Onglet [DONS] >', async () => {        
            
            test('Onglet [DONS] - Click', async () => {
                await menu.clickOnglet(currentPage, 'dons', page);
            })

            test('Button [INPRIMER UN RECU] - Click', async () =>  {
                await fonction.clickAndWait(pageDon.buttonImprimerRecu, page, 40000);
            })
    
            var sNomPopin = 'IMPRIMER UN RECU';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {            
    
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })      
                
                test('ListBox [BENEFICIARE][rnd] - Click', async () =>  {
                    var iNbChoix = await pageDon.pPlistBoxBenefImpRecu.locator('option').count()
                    var rnd = Math.floor(fonction.random() * iNbChoix);
                    var sChoix = await pageDon.pPlistBoxBenefImpRecu.locator('option').nth(rnd).textContent()
                    if (sChoix){
                        log.set('Bénéficiare : ' + sChoix);
                        await fonction.listBoxByLabel(pageDon.pPlistBoxBenefImpRecu, sChoix, page)
                    }
                })                          
                
                test('DatePeacker [MOIS DON][Janvier] - Click', async () =>  {
    
                    var verifie = false
    
                    await pageDon.pPDatePeackerImprimerRecu.click()
                    while (!verifie){
                        await pageDon.pDatePeackerButtonPrev.click()
                        var mois  = await pageDon.pDatePeackerSwitchLabel.textContent()
                        if(mois?.match('Janvier')){
                            verifie = true
                        }
                    }
                    if(verifie){
                        await pageDon.pDatePeackerLabelDays.nth(0).click()
                    }
                }) 
    
                test('Button [IMPRIMER] - Click', async () => {
                    await fonction.clickElement(pageDon.pPbuttonImprimerRecu);
                })
    
                test('Link [ANNULER] - Click Conditionnel', async () => {
                    if (await pageDon.pPlinkAnnulerImprimerRecu.isVisible()){
                        await pageDon.pPlinkAnnulerImprimerRecu.click();
                    }else {
                        console.log('Link [ANNULER] - Click: ANNULER')
                        test.skip()
                    }
                })
                
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })                          
            })
        })//-- End Describe Onglet    
    }) //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test('Log [INFO]', async () => {
        await log.get();
    })
})
