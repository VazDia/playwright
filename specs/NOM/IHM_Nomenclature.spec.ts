/**
 * @author JC CALVIERA
 */

const xRefTest      = "NOM_IHM_GLB";
const xDescription  = "Examen de l'IHM Nomenclature";
const xIdTest       =  1095;
const xVersion      = '3.3';

var info:CartoucheInfo = {
	desc    : xDescription,
	appli   : 'NOMENCLATURE',
	version : xVersion,
	refTest : [xRefTest],
	idTest  : xIdTest,
	help    : [],
	params  : [],
	fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page } 			from '@playwright/test';

import { Help }                    	from '@helpers/helpers.js';
import { TestFunctions }           	from '@helpers/functions.js';

import { MenuNomenclature }        	from '@pom/NOM/menu.page.js';
import { Nomenclature }            	from '@pom/NOM/nomenclature.page.js';
import { Article }                 	from '@pom/NOM/articles.page.js';
import { Caracteristique }         	from '@pom/NOM/caracteristiques.page.js';
import { Composition }             	from '@pom/NOM/composition.page.js';
import { GroupeArticle }           	from '@pom/NOM/groupe-article.page.js';

import { CartoucheInfo, TypeListOfElements } from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;

// Chargement des Pages Objects
let menu            : MenuNomenclature;

let pageNomenclature: Nomenclature;
let pageArticle     : Article;
let pageGpArticle   : GroupeArticle;
let pageCaracterist : Caracteristique;    
let pageComposition : Composition; 

// Chargement des helpers    
const fonction      = new TestFunctions();

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage();
	menu            = new MenuNomenclature(page, fonction);	
	pageNomenclature= new Nomenclature(page);
	pageArticle     = new Article(page);
    pageGpArticle   = new GroupeArticle(page);
	pageCaracterist = new Caracteristique(page);
	pageComposition = new Composition(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async() => {
       await fonction.connexion(page);
    })

	test.describe('Page [ARTICLES]', () => {

		var pageName = 'articles';

		test('Page [ARTICLES] - Click', async () => {
			await menu.click(pageName, page);
		});

		test('Input, button, listBox, checkBox and toggle [Is visible] - Check', async () => {
			fonction.isDisplayed(pageArticle.inputArticle);
			fonction.isDisplayed(pageArticle.inputCodeCaisse);
			fonction.isDisplayed(pageArticle.inputFamille);
			fonction.isDisplayed(pageArticle.inputSousFamille);
			fonction.isDisplayed(pageArticle.inputCaracteristique1);
			fonction.isDisplayed(pageArticle.inputCaracteristique2);
			fonction.isDisplayed(pageArticle.inputValeur1);
			fonction.isDisplayed(pageArticle.inputValeur2);
			fonction.isDisplayed(pageArticle.listBoxRayon);
			fonction.isDisplayed(pageArticle.listBoxGroupe);
			fonction.isDisplayed(pageArticle.toggleArticleAnoNonRens);
			fonction.isDisplayed(pageArticle.toggleArticleAnoOui);
			fonction.isDisplayed(pageArticle.toggleArticleAnoNon);
			fonction.isDisplayed(pageArticle.toggleArticleNonRens);
			fonction.isDisplayed(pageArticle.toggleArticleOui);
			fonction.isDisplayed(pageArticle.toggleArticleNon);
			fonction.isDisplayed(pageArticle.checkBoxValeurNonRens1);
			fonction.isDisplayed(pageArticle.checkBoxValeurNonRens2);
			fonction.isDisplayed(pageArticle.buttonCreer);
			fonction.isDisplayed(pageArticle.buttonModifier);
			fonction.isDisplayed(pageArticle.buttonCopier);
			fonction.isDisplayed(pageArticle.buttonDiffuser);
			fonction.isDisplayed(pageArticle.buttonActiver);
			fonction.isDisplayed(pageArticle.buttonDesactiver);
			fonction.isDisplayed(pageArticle.buttonRechercher);
			fonction.isDisplayed(pageArticle.buttonVider);
		})

	   //-------------------------------------------------------------------------------------------------------------------------- 

		test('DataGrid [LISTE ARTICLES]  - Check', async ({}, testInfo) => {
			var oDataGrid = 
			{
				element     : pageArticle.dataGridArticles,    
				desc        : testInfo.line,
				verbose     : false,
				column      :   
					[
						'',
						'Code',
						'Désignation',
						'Rayon',
						'Groupe',
						'Famille',
						'Sous-Famille',
						'Actif',
						'En anomalie',
						'Actions',              
					]
			}
			fonction.dataGridHeaders(oDataGrid);
		})

		//-------------------------------------------------------------------------------------------------------------------------- 

		test.describe('Popin [CREATION D\'UN ARTICLE]', () => {

			test('Button [CREER] - Click', async () => {
				await fonction.clickAndWait(pageArticle.buttonCreer, page);

			});

			test('Popin [CREATION D\'UN ARTICLE] - Check', async () => {
				await fonction.popinVisible(page, "Création d'un article", true); //expect(pageArticle.pPcreationModalDialog).toBeVisible();
			});
			
			test('Button [ENREGISTRER ET NOUVEAU] - Is Visible',async() => {
				fonction.isDisplayed(pageArticle.pPcreationButtonEnrNouv);
			})
			
			test('Button [ENREGISTRER ET COPIER] - Is Visible',async() => {
				fonction.isDisplayed(pageArticle.pPcreationButtonEnrCopy);
			})
			
			test('Button [ENREGISTRER] - Is Visible',async() => {
				fonction.isDisplayed(pageArticle.pPcreationButtonEnreg);
			})
			
			test('inputField [RECHERCHER DANS NOMENCLATURE] - Is Visible',async() => {
				fonction.isDisplayed(pageArticle.pPcreationInputSearchNom);
			})
			
			test('inputField [RECHERCHER DIRECT A L\'ARTICLE] - Is Visible',async() => {
				fonction.isDisplayed(pageArticle.pPcreationInputSearchDir);
			})

			test('Button [ANNULER] - Click', async () => {
				await fonction.clickAndWait(pageArticle.pPcreationLinkAnnuler, page);
			});
		})
	})

	test.describe('Page [GROUPE ARTICLE]', () => {

		var pageName = 'groupeArticle';

		test('Menu page [GROUPE ARTICLE] - Click', async () => {
			await menu.click(pageName, page);
		});

		test('Button [Is visible] - Check', async () => {
			fonction.isDisplayed(pageGpArticle.buttonValeursAuto);
			fonction.isDisplayed(pageGpArticle.buttonDissocier);
			fonction.isDisplayed(pageGpArticle.buttonPlageCodeArticle);
		})

		//--------------------------------------------------------------------------------------------------------------------------

		test('Li [GROUPE ARTICLE] - Check', async ({}, testInfo) => {
			var oDataGrid:TypeListOfElements = 
			{
				element     : pageGpArticle.nodeGroupesArticles,    
				desc        : testInfo.line.toString(),
				verbose     : false,
				column      :   
					[
                        'BCT',
                        'Affetati e gastronomia',
                        'Boucherie',
                        'Charcuterie',
                        'Macelleria',
                        'Traiteur BC',
                        'Boulangerie',
                        'Boulangerie',
                        'Crémerie',
                        'Coupe / Corner',
                        'Frais LS',
                        'IT - Coupe / Corner',
                        'IT - Frais LS',
                        'Epicerie',
                        'Epicerie',
                        'IT - Boulangerie',
                        'IT - Epicerie LS',
                        'IT - Stand',
                        'IT - Surgelés',
                        'Frais Généraux',
                        'Consommable',
                        'IT - Consommable',
                        'IT - Sac',
                        'Matériel informatique',
                        'Sac',
                        'Fruits et légumes',
                        'Fraîche découpe',
                        'Fruits et légumes',
                        'IT - Fraîche découpe',
                        'Poissonnerie',
                        'IT - Négoce',
                        'IT - Traiteur DM',
                        'Marée',
                        'Négoce',
                        'Traiteur de la mer',
                        'Traiteur',
                        'Elaborés',
					]
			}
			await fonction.elementInList(oDataGrid);  
		})

		//--------------------------------------------------------------------------------------------------------------------------

		test.describe('Node [IT - Coupe / Corner]', () => {

		 	test('Node [GROUPE ARTICLE] = "IT - Coupe / Corner" - Click', async () => {
				await pageGpArticle.nodeGroupesArticles.filter({ hasText: 'IT - Coupe / Corner' }).click();
		 	});

			test('Label, button and input [Is visible] - Check', async () => {
				fonction.isDisplayed(pageGpArticle.labelBreadCrumb);
				fonction.isDisplayed(pageGpArticle.inputAssocierCarac);
				fonction.isDisplayed(pageGpArticle.inputCaracteristique);
				fonction.isDisplayed(pageGpArticle.buttonPlus);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 

			test('DataGrid [CARACTERISTIQUES] - Check', async ({}, testInfo) => {
				var oDataGrid = 
				{
					element     : pageGpArticle.dataGridCarac,    
					desc        : testInfo.line,
					verbose     : false,
					column      :   
						[
							'Caractéristique',
							'Valeurs autorisées',
							'Type',
							'Obligatoire',
							'Saisie conditionnelle',
							'Actions'
						]
				}
				fonction.dataGridHeaders(oDataGrid);
			})

			//--------------------------------------------------------------------------------------------------------------------------

			test.describe('Popin [PARAMETRAGE DE LA PLAGE DE CODE ARTICLE]', async () => {

				 test('Button [PLAGE DE CODE ARTICLE] - Click', async () => {
					await fonction.clickAndWait(pageGpArticle.buttonPlageCodeArticle, page);
				});

				test('CheckBox, button and input [Is visible] - Check', async () => {
					fonction.isDisplayed(pageGpArticle.pCheckBoxAlphaNum);
					fonction.isDisplayed(pageGpArticle.pInputPlageMin);
					fonction.isDisplayed(pageGpArticle.pInputPlageMax);
					fonction.isDisplayed(pageGpArticle.pInputCommencePar);
					fonction.isDisplayed(pageGpArticle.pInputNeCommencePasPar);
					fonction.isDisplayed(pageGpArticle.pButtonValider);
					fonction.isDisplayed(pageGpArticle.pButtonAnnuler);
				})

				 test('Link [ANNULER] - Click', async () => {
					await pageGpArticle.pButtonAnnuler.click();
				});

			});

		})

	})

	test.describe('Page [CARACTERISTIQUES]', () => {

		var pageName = 'caracteristiques';

		test('Menu page [CARACTERISTIQUES] - Click', async () => {
			await menu.click(pageName, page);
		});

		test('Button and input [Is visible] - Check', async () => {
			fonction.isDisplayed(pageCaracterist.buttonCreerCarac);
			fonction.isDisplayed(pageCaracterist.buttonModifierCarac);
			fonction.isDisplayed(pageCaracterist.buttonSupprimerCarac);
			fonction.isDisplayed(pageCaracterist.buttonSupprimerValeur);
			fonction.isDisplayed(pageCaracterist.inputSearchDesignation);
		})

		//--------------------------------------------------------------------------------------------------------------------------

		test('DataGrid [CARACTERISTIQUES] - Check', async ({}, testInfo) => {
			var  oDataGrid = 
				{
					element     : pageCaracterist.dataGridCarac,    
					desc        : testInfo.line,
					verbose     : false,
					column      :   
						[
							'',
							'Désignation',
							'Description',
							'Type',
							'Actions',             
						]
				}
				fonction.dataGridHeaders(oDataGrid);      
		})

		//--------------------------------------------------------------------------------------------------------------------------

		test.describe('Popin [CREATION D\'UNE CARACTERISTIQUE]', async () => {

			test('Button [CREER CARACTERISTIQUE] - Click', async () => {
				await pageCaracterist.buttonCreerCarac.click();
			});

			test('CheckBox, button and input [Is visible] - Check', async () => {
				fonction.isDisplayed(pageCaracterist.pInputDesignation); 
				//Test.checkListBox(pageCaracterist.pListBoxTypeCarac);
				fonction.isDisplayed(pageCaracterist.pTexteAreaDescription);                
				fonction.isDisplayed(pageCaracterist.pButtonCreer);   
				fonction.isDisplayed(pageCaracterist.pButtonAnnuler); 

			})

			test('Button [ANNULER] - Click', async () => {
				await fonction.clickAndWait(pageCaracterist.pButtonAnnuler, page);
			});

		});
	})

	test.describe('Page [NOMENCLATURE]', () => {

		var pageName = 'nomenclature';

		test('Page [NOMENCLATURE] - Click', async () => {
			await menu.click(pageName, page, 10000, false);
		});

		test('button and input [Is visible] - Check', async () => {
			fonction.isDisplayed(pageNomenclature.inputSearchNomenclature);
			fonction.isDisplayed(pageNomenclature.inputSearchAccesDirect);
			fonction.isDisplayed(pageNomenclature.buttonDeplacerArticles);
		})

	})

	test.describe('Page [COMPOSITION]', async () => {

		var pageName = 'composition';

		test('Menu page [COMPOSITIOM] - Click', async () => {
			await menu.click(pageName, page);
		});

		test('ListBox, button and input [Is visible] - Check', async () => {
			fonction.isDisplayed(pageComposition.inputArticle);
			fonction.isDisplayed(pageComposition.inputFamille);
			fonction.isDisplayed(pageComposition.inputSousFamille);
			fonction.isDisplayed(pageComposition.listBoxRayon);
			fonction.isDisplayed(pageComposition.listBoxGroupe);
			fonction.isDisplayed(pageComposition.buttonRechercher);
			fonction.isDisplayed(pageComposition.buttonVider);
			fonction.isDisplayed(pageComposition.buttonModifCompo);
		})

		//-------------------------------------------------------------------------------------------------------------------------- 

		test('DataGrid [ARTICLES] - Check', async ({}, testInfo) => {
			var oDataGrid = 
			{
				element     : pageComposition.dataGridArticles,    
				desc        : testInfo.line,
				verbose     : false,
				column      :   
					[
						'',
						'Code',
						'Désignation',
						'Rayon',
						'Groupe',
						'Famille',
						'Sous-Famille',
						'Est un ingrédient',
						'Est élaboré',
						'Actions',           
					]
			}
			fonction.dataGridHeaders(oDataGrid);      
		})

		//--------------------------------------------------------------------------------------------------------------------------
	});

	test.describe('Page [ADMIN]', () => {

		var pageName = 'admin';

		test('Menu page [ADMIN] - Click', async () => {
			await menu.click(pageName, page);
		});

		test('Onglet [ADMINISTRATION] - Click', async () => {
			await menu.clickOnglet(pageName, 'administration', page);
		});

		test('Onglet [COMMUNICATION UTILISATEURS] - Click', async () => {
			await menu.clickOnglet(pageName, 'communicationUtlisateurs', page);
		});

		test('Onglet [PARAMETRAGE] - Click', async () => {
			await menu.clickOnglet(pageName, 'parametrage', page);
		});

		test('Onglet [CHANGELOG] - Click', async () => {
			await menu.clickOnglet(pageName, 'Changelog', page);
		});

	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})