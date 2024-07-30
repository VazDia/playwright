/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 27 - 11 - 2023
 */

const xRefTest      = "MAG_VTE_ART";
const xDescription  = "Lister les ventes d'un article";
const xIdTest       =  27;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville', 'codeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}       from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { VentesArticle }                from '@pom/MAG/ventes-article.page';

import { AutoComplete, CartoucheInfo } 	from '@commun/types';

//-------------------------------------------------------------------------------------

let page         : Page;

let menu         : MenuMagasin;
let pageVArticle : VentesArticle;

const log        = new Log();
const fonction   = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sNomVille    = process.env.VILLE || 'Agde (F718)';
const sCodeArticle = process.env.CODEARTICLE || '5300'; 

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageVArticle    = new VentesArticle(page);
});

test.afterAll(async () => {
    await fonction.close();
})

//-----------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
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
    })

    test.describe('Page [VENTES]', async () => {
        
        var sNomPage = 'ventes';

        test('Page [VENTES] - Click', async () => {
            await menu.click(sNomPage, page);
        })    

        test('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () =>{
            await menu.selectVille(sNomVille, page);
        })

        test.describe('Onglet [ANALYSE DES VENTES]', async () => {
   
            test('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })                          

            test('InputField [AUTOCOMPLETE][ARTICLE] = "' + sCodeArticle + '"', async () => {
                var oData:AutoComplete = {
                    libelle         :'ARTICLE',
                    inputLocator    : pageVArticle.inputArticle,
                    inputValue      : sCodeArticle,
                    choiceSelector  :'li.gfit-autocomplete-result',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                };
                await fonction.autoComplete(oData);
            })

            test('DatePicker [SUR LA PERIODE DU] - Click', async () => {
                await pageVArticle.datePickerVentesDu.click();
            })

            test('Pictogramme [ << ] - Click', async () => {
                await pageVArticle.pictoMoisPrecedent.click();
            })

            test('Day [1] - Click', async () => {
                await fonction.clickElement(pageVArticle.tdActiveDays.first());
            })

            test('Button [RECHERCHER] - Click', async () => {
                await fonction.clickAndWait(pageVArticle.buttonRechercher, page);
            })            

            test('Label [Montant TTC total des ventes] > 0 €', async () =>{
                if (await pageVArticle.dataGridListeVentesLine.first().isVisible()){
                    var sTexte = await pageVArticle.labelTotalDesVentes.textContent();
                    log.set('Code Article : ' + sCodeArticle);
                    if(sTexte){
                        log.set(sTexte.trim());
                        var aBouts   = sTexte.split(' : ');
                        var sMontant = aBouts[1];
                        sMontant     = sMontant.replace('€', '');
                        sMontant     = sMontant.replace(' ', '');
                        sMontant     = sMontant.replace(',', '.');
                        var iMontant = parseInt(sMontant);
                        expect(iMontant).toBeGreaterThan(0);
                    }
                }else{
                    log.set('Aucune vente pour cette recherche : la verification du montant TTC total des ventes est annulée')
                    test.skip();
                }
            })

        }); // end describe

    }); // end describe

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})