/**
 * @author  Josias SIE
 * @since   15-07-2024
 * 
 */
const xRefTest      = "5.2.1 STO_PAR_IMP";  
const xDescription  = "Visualisation et Sélection des imprimantes pour les feuilles et les étiquettes (grandes et petites)";
const xIdTest       =  2067;
const xVersion      = '3.0'; 
  
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,  
	help        : [],        
	params      : ['plateForme'],
	fileName    : __filename
}
   
//------------------------------------------------------------------------------------

import { expect, test, type Page} from '@playwright/test';
import { Help }                   from '@helpers/helpers.js';
import { TestFunctions }          from '@helpers/functions.js';
import { Log }                    from '@helpers/log.js';
import { CartoucheInfo }          from '@commun/types';
//-- PageObject ----------------------------------------------------------------------

import { MenuStock }              from '@pom/STO/menu.page.js'; 
import { ReferentielParametres }  from '@pom/STO/referentiel-parametres.page.js';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuStock;
let pageRefParamImp       : ReferentielParametres;
const log                 = new Log();
const fonction            = new TestFunctions(log);

//------------------------------------------------------------------------------------
const sPlateforme         = fonction.getInitParam('plateForme', 'Milan');
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	 page                 = await browser.newPage();
	 menu                 = new MenuStock(page, fonction);
	 pageRefParamImp      = new ReferentielParametres(page);
	 const helper         = new Help(info, testInfo, page);
	 await helper.init();
})

test.afterAll(async ({}) => {
	await fonction.close();
})
  
//------------------------------------------------------------------------------------
test.describe.serial('[' + xRefTest + ']', async () => {  
	
	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
        await fonction.connexion(page);
    })

	test.describe ('Page [REFERENTIEL]', async () => {    

		var sNomPage = 'referentiel';

		test ('Page [REFERENTIEL] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {                    
			await menu.selectPlateforrme(page, sPlateforme);
		})

		test.describe ('Onglet [PARAMETRES D\'IMPRESSION]', async () => {        
			
			test ('Onglet [PARAMETRES D\'IMPRESSION] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'parametres', page);
			})   

			test ('Select [IMPRIMANTE D\'IMPRESSION DE FEUILLES] - Click', async () => {
				const selectBox      = pageRefParamImp.listBoxImprimFeuilles;
				const nbOption       = await pageRefParamImp.listBoxImprimFeuilles.locator('option').count();
				const selectedOption = selectBox.locator('option:checked');
				const value          = await selectedOption.getAttribute('value');
				const text           = await selectedOption.textContent();

				if (text == '' && nbOption > 1 ) {
					await pageRefParamImp.listBoxImprimFeuilles.selectOption({index: 1});
					log.set('Aucune valeur par défaut sélectionnée.');
				} else {
					log.set(`La valeur par défaut sélectionnée est: ${value} (${text.trim()})`);
				}
			}) 

			test ('Select [IMPRIMANTE D\'IMPRESSION D\'ETIQUETTES] - Click', async () => {
				const selectBox      = pageRefParamImp.listBoxImprimEtiquettes;
				const nbOption       = await pageRefParamImp.listBoxImprimEtiquettes.locator('option').count();
				const selectedOption = selectBox.locator('option:checked');
				const value          = await selectedOption.getAttribute('value');
				const text           = await selectedOption.textContent();

				if (text == '' && nbOption > 1 ) {
					await pageRefParamImp.listBoxImprimEtiquettes.selectOption({index: 1});
					log.set('Aucune valeur par défaut sélectionnée.');
				} else {
					log.set(`La valeur par défaut sélectionnée est: ${value} (${text.trim()})`);
				}
			}) 

			test ('Select [IMPRIMANTE D\'IMPRESSION D\'ETIQUETTES REDUITES] - Click', async () => {
				const selectBox      = pageRefParamImp.listBoxImprimEtiquettesReduit;
				const nbOption       = await pageRefParamImp.listBoxImprimEtiquettesReduit.locator('option').count();
				const selectedOption = selectBox.locator('option:checked');
				const value          = await selectedOption.getAttribute('value');
				const text           = await selectedOption.textContent();

				if (text == '' && nbOption > 1 ) {					
					await pageRefParamImp.listBoxImprimEtiquettesReduit.selectOption({index: 1});
					log.set('Aucune valeur par défaut sélectionnée.');
				} else {
					log.set(`La valeur par défaut sélectionnée est: ${value} (${text.trim()})`);
				}
			}) 
		})	// End ONGLET 
		
		test('Button [ENREGISTRER] - Click', async () => {
			var isActive = await pageRefParamImp.buttonEnregistrer.isEnabled();
			if(isActive){
				await fonction.clickAndWait(pageRefParamImp.buttonEnregistrer, page);
				var isNotActive = await pageRefParamImp.buttonEnregistrer.isDisabled();
				expect(isNotActive).toBe(true);
			}
		})
	})  //-- End Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})// end describe
}) 