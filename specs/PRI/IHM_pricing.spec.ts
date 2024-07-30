/**
 * 
 * PRICING APPLICATION > CONTENU
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/09/22
 * 
 */

const xRefTest      = "PRI_IHM_GLB";
const xDescription  = "Examen de l'IHM Pricing";
const xIdTest       =  567;
const xVersion      = '3.8';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'PRI',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : [],
	fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { test, type Page, expect }          from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log.js';

import { MenuPricing }                      from '@pom/PRI/menu.page.js';
import { TarificationPage }                 from '@pom/PRI/tarification_tarification.page.js';
import { SimulationPrixPage }               from '@pom/PRI/tarification_simulation-prix.page.js';
import { AlignementsPage }                  from '@pom/PRI/alignements.page.js';
import { GestionsMagasinPage }              from '@pom/PRI/gestions_magasins.page.js';
import { StrategiesArticlesPage }           from '@pom/PRI/strategies_articles.page.js';
import { AdminParametrage }                 from '@pom/PRI/admin_parametrage.page.js';

import { CartoucheInfo, TypeListOfElements }from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menuPage            : MenuPricing;

let pageTarif           : TarificationPage;
let pageTarifSimulation : SimulationPrixPage;
let pageAlignement      : AlignementsPage;
let pageGestion         : GestionsMagasinPage;
let pageStrategies      : StrategiesArticlesPage;
let pageAdminParametrage: AdminParametrage;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {

	page                = await browser.newPage();

	menuPage            = new MenuPricing(page, fonction);
	
	pageTarif           = new TarificationPage(page);
	pageTarifSimulation = new SimulationPrixPage(page);
	pageAlignement      = new AlignementsPage(page);
	pageGestion         = new GestionsMagasinPage(page);
	pageStrategies      = new StrategiesArticlesPage(page);
	pageAdminParametrage= new AdminParametrage(page);

	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}) => {
	await fonction.close();
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [ACCUEIL]', async () => {

		test ('ListBox [RAYON] = "Fruits et légumes"', async () =>{
			await fonction.isDisplayed(menuPage.listBoxRayon)
			await menuPage.selectRayonByName('Fruits et légumes', page);
		})
	})

	test.describe ('Page [TARIFICATION]', async () => {

		var pageName = 'tarification';

		test ('Page [TARIFICATION] - Click',async () => {
			await menuPage.click(pageName, page);
		})

		test.describe ('Onglet [TARIFICATION]', async () => {

			test ('Button [TARIFICATION] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonTarification); 
			})

			test ('Button [ENREGISTRER] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonEnregistrer);  
			})
		
			test ('Button [VALIDER] - is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonValider);
			})
			
			test ('Button [INVALIDER] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonInvalider); 
			})         
		
			test ('Button [TARIFS MAGASINS] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonTarifsMagasin);
			}) 

			test ('Button [MARGES GLOBALES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonMargesGlobales); 
			}) 

			test ('Button [EXPORT CSV] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonExport);  
			})

			test ('Button [EXPORT PVC] - Is Visible', async() =>{
				await pageTarif.buttonExport.hover({timeout:1000});    
				await fonction.isDisplayed(pageTarif.buttonExportPVC);
			})

			test ('Button [EXPORT TARIFICATIONS] - Is Visible', async () =>{
				await pageTarif.buttonExport.hover({timeout:1000});     
				await fonction.isDisplayed(pageTarif.buttonExportTarification);
			})

			test ('Button [HISTORIQUE] - Is Visible', async () =>{     
				await fonction.isDisplayed(pageTarif.buttonHistorique);
			})

			test ('Button [DATE DE FIN DE VALIDITE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonDateFinValidite); 
			})
	
			test ('DatePicker [EDITION TARIF] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.datePickerEditionTarif);  
			})
		
			test ('ListBox [GROUPE ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.listBoxGroupeArticle);  
			})

			test ('ListBox [GROUPE MAGASINS] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.listBoxGroupeMagasin);  
			})
		
			test ('Toggle Button [SAISIE GROUPEE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.toogleButtonSaisieGroupee);
			})
		
			test ('Button [COLONNES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonColonnes);
			})

			test ('InputField [ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputArticle); 
			})  

			test ('InputField [DESIGNATION ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputDesignArticle); 
			})  

			test ('InputField [CA HEBDO] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputCAHebdo); 
			})  

			test ('InputField [NOMBRE MAGASINS LIVRES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputNbMagLivres); 
			}) 

			test ('InputField [MOYENNE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputMoyenne); 
			})  

			test ('InputField [PRIX DE REVIENT HT MOYEN PRECEDENT] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputPrixRevHTMoyPrec); 
			})  

			test.skip('InputField [PVC TTC PRECEDENT] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputPVCTTC); 
			})  

			test ('InputField [PVC TTC THEORIQUE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputPVCTTCTheo); 
			})  

			test ('InputField [MARGE MAGASIN] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputMargeMagasin); 
			})  
			
			test.skip('InputField [PRIX DE CESSION HT] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputPrixCessionHT);
			})
		
			test.skip('InputField [PVC TTC] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputPVCTTC);
			})  
			
			test ('InputField [MARGE PLATEFORME] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputMargePlateforme); 
			})

			test ('CheckBox [AFFICHAGE AUTO] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.checkBoxAffichageAuto); 
			})  
		
			test ('CheckBox [TARIFICATION PERMANENTE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.checkBoxTarificationPerm); 
			}) 

			test ('CheckBox [ALERTES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.checkBoxAlertes); 
			}) 

			test ('CheckBox [TARIFS VALIDES TARIFES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.checkBoxTarifeValide); 
			}) 

			test ('CheckBox [COMPOSITION] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.checkBoxComposition); 
			}) 

			test ('CheckBox [TOUS LES TARIFS] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.checkBoxAllTarifs); 
			}) 

			test.describe ('Popin [AJOUT DE TARIFICATION]', async () => {

				test ('Button [FACTURER LES FACTURES DE REGULARISATION] - Click', async () => {
					await fonction.clickAndWait(pageTarif.buttonTarification, page);
				})

				test ('AJOUT DE TARIFICATION - Is Visible', async () => {
					await pageTarif.pPopinAjouttarification.isVisible()
				})
				
				test ('Button [ENREGISTRER] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pPbuttonSauvegarder);
				})
				
				test ('Button [ANNULER] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pButtonAnnuler);  
				})
					
				test ('InputField [ARTICLE] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputArticle);   
				})                   
					
				test ('Link [PROMOTION] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pLinkPromotion);
				})               
				
				test ('Link [TARIFICATION] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pLinkTarification);
				})
			
				test ('Link [BAISSE TARIFICATION] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pLinkBaisseTarification);
				})
				
				test ('InputField [NOM] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputNom);
				})
				
				test ('InputField [PRIX CESSION] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputPrixCession);
				})
				
				test ('InputField [PVC] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputPVC);
				})
			
				test ('InputField [PVC HORS LOTS] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputPVCDetailHorsLots);
				})
				
				test ('InputField [NB OFFERT] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputNbOffert);
				})
				
				test ('InputField [NB ACHETE] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputNbAchete);
				})
				
				test ('ListBox [TYPE PROMO] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pListBoxTypePromo);
				})
			
				test ('ListBox [NATURE DETAIL] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pListBoxNatureDetail);
				})
				
				test ('DatePicker [FIN PROMO] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pDatePickerFinPromo);
				})
				
				test ('CheckBox [CONDITION TARIFAIRE] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pCheckBoxConditionsTarif);
				})
				
				test ('CheckBox [VENTE DETAIL] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pCheckBoxVenteDetail);
				})
				
				test ('InputField [MAGASIN] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputMagasin);
				})
				
				test ('SECTEUR PROSOL', async () => {
					fonction.checkListBox(pageTarif.pListBoxSecteurProsol);
				})
				
				test ('REGION PROSOL', async () => {
					fonction.checkListBox(pageTarif.pListBoxRegionProsol);
				})
				
				test ('ListBox [REGION GEOGRAPHIQUE] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pListBoxRegionGeographique); 
				})
			
				test ('REGION GEOGRAPHIQUE#####', async () => {
					fonction.checkListBox(pageTarif.pListBoxRegionGeographique);
				})
			
				test ('Toggle [SELECTIONNES]', async () => {
					await fonction.isDisplayed(pageTarif.pToggleSelectionnes);
				})
				
				test ('Toggle [NON SELECTIONNES]', async () => {
					await fonction.isDisplayed(pageTarif.pToggleNonSelectionnes);
				})
				
				test ('Toggle [STRATEGIE]', async () => {
					await fonction.nbElementsGreaterThan(pageTarif.pToggleStrategie, 2);
				})
				
				test ('Toggle [PLATEFORME]', async () => {
					await fonction.nbElementsGreaterThan(pageTarif.pTogglePlateforme, 3);
				})
				
				test ('Toggle [GROUPE MAGASIN]', async () => {
					await fonction.nbElementsGreaterThan(pageTarif.pToggleGroupeMagasins, 1);
				})

				test ('DataGrid [LISTE DES MAGASINS] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageTarif.dataGridListeMagasins,    
						desc        : 'DataGrid [LISTE DES MAGASINS]',
						column      :   
							[
								'0',
								'Code',
								'Abréviation',
								'Région géographique',
								'Secteur Prosol',
								'Nouveau',
								'Stratégie',
								'Ouvert le dimanche',             
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Button [ANNULER] - Click', async() =>{
					await fonction.clickElement(pageTarif.pButtonAnnuler);
				})  

				test ('Popin [AJOUT DE TARIFICATION] - Is Not Visible', async () => {
					await expect(pageTarif.pPopinAjouttarification).toBeHidden()
				})

			})

			var sNomPopin = "CALCUL DES MARGES";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

				test ('Button [MARGES GLOBALES] - Click', async () => {
					await fonction.clickAndWait(pageTarif.buttonMargesGlobales, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await pageTarif.pPopinCalculMArgeSurPeriode.isVisible()
				})

				test ('Label [ERROR] -  Is Not Visible', async () =>{ 
					await fonction.isErrorDisplayed(false, page)
				})              

				test ('ListBox [ENSEIGNE]', async () => {
					await fonction.isDisplayed(pageTarif.pPcalcMargeListBoxEnseigne);
				})
					
				test ('Switch [INCLURE LES EXTERNES]', async () => {
					await fonction.isDisplayed(pageTarif.pPcalcMargeSwitchLiensExt);
				})    
					
				test ('Button [CALCULER]', async () => {
					await fonction.isDisplayed(pageTarif.pPcalcMargeButtonCalculer);
				})       
			
				test ('Link [FERMER]', async () => {
					await fonction.isDisplayed(pageTarif.pPcalcMargeLinkFermer); 
				})       
				
				test ('InputField [FAMILLE]', async () => {
					await fonction.isDisplayed(pageTarif.pPcalcMargeInputFamille); 
				})       
				
				test ('InputField [SOUS FAMILLE]', async () => {
					await fonction.isDisplayed(pageTarif.pPcalcMargeInputSousFamille); 
				})       
					
				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageTarif.pPcalcMargeLinkFermer);
				})                

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await expect(pageTarif.pPopinCalculMArgeSurPeriode).toBeHidden()
				})

			})  // End describe Popin

			test.describe ('Popin [CONFIRMATION ENVOI DES TARIFICATIONS]', async () => {

				test ('Button [TARIFS MAGASINS] - Click', async () => {
					await fonction.clickAndWait(pageTarif.buttonTarifsMagasin, page);
				})

				test ('CONFIRMATION ENVOI DES TARIFICATIONS - Is Visible', async () => {
					await pageTarif.pPopinConfirmationEnvoieTarification.isVisible()
				})

				test ('Label [ERROR] -  Is Not Visible', async () =>{
					await fonction.isErrorDisplayed(false, page);
				})                         

				test ('Button [ENVOYER PARTIELLEMENT]', async () => {
					await fonction.isDisplayed(pageTarif.pButtonEnvoiPartiel);
				})
				
				test ('Button [ENVOYER DEFINITIVEMENT]', async () => {
					await fonction.isDisplayed(pageTarif.pButtonEnvoiDefinitif);
				})
				
				test ('Button [ANNULER]', async () => {
					await fonction.isDisplayed(pageTarif.pButtonEnvoiAnnuler); 
				})
							
				test ('Button [ANNULER] - Click', async() => {
					await fonction.clickElement(pageTarif.pButtonEnvoiAnnuler);
				})                

				test ('CONFIRMATION ENVOI DES TARIFICATIONS - Is Not Visible', async () => {
					await expect(pageTarif.pPopinConfirmationEnvoieTarification).toBeHidden()
				})
			})  // End describe Popin

			test.describe ('Popin [HISTORIQUE DES PRIX (HORS PROMOTION)]', async () => {

				test ('Button [HISTORIQUE] - Click', async () => {
					await fonction.clickAndWait(pageTarif.buttonHistorique, page);
				})

				test ('HISTORIQUE DES PRIX (HORS PROMOTION) - Is Visible', async () => {
					await pageTarif.pPopinHistoriqueDesPrix.isVisible()
				})

				test ('Label [ERROR] -  Is Not Visible', async () =>{
					await fonction.isErrorDisplayed(false, page);
				})                         

				test ('Input [ARTICLE]', async () => {
					await fonction.isDisplayed(pageTarif.pPInputArticle);
				})
				
				test ('DatePicker [DATE DE DEBUT]', async () => {
					await fonction.isDisplayed(pageTarif.pPDatePickerDebut);
				})
				
				test ('DatePicker [DATE DE FIN]', async () => {
					await fonction.isDisplayed(pageTarif.pPDatePickerFin); 
				})
					
				test ('Button [Afficher]', async () => {
					await fonction.isDisplayed(pageTarif.pPButtonAfficher); 
				})

				test ('Button [ANNULER] - Click', async() => {
					await fonction.clickElement(pageTarif.pPlinkFermer);
				})                

				test ('HISTORIQUE DES PRIX (HORS PROMOTION) - Is Not Visible', async () => {
					await expect(pageTarif.pPopinHistoriqueDesPrix).toBeHidden();
				})
			})  // End describe Popin

		})	//-- Onglet
	
		test ('ListBox [RAYON] = "Crèmerie"', async () =>{
			await fonction.isDisplayed(menuPage.listBoxRayon)
			await menuPage.selectRayonByName("Crèmerie", page);
		})

		test.describe ('Onglet [SIMULATION PRIX]', async () => {
	
			test ('Onglet [SIMULATION PRIX] - Click', async () => {
				await menuPage.clickOnglet(pageName, 'simulationPrix', page);
			})

			test ('Button [ENREGISTRER] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonEnregistrer);  
			})

			test ('Button [EXPORTER] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonExporter);  
			})

			test ('Button [CALCULER LES MARGES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonCalculerMarges);  
			})

			test ('Button [MODIFIER LES PRIX DE CESSION] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonModifierPrixCession);  
			})

			test ('Button [MODIFIER LES PVC TTC] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonModifierPVCTTC);  
			})

			test ('Button [APPLIQUER LES MODIFICATIONS] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonAppliquerModifications);  
			})

			test ('Button [MODIFIER LES VENTES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonModifierVentes);  
			})

			test ('Button [AJOUTER UNE LIGNE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonAjouterLigne);  
			})

			test ('InputField [FOURNISSEUR] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.inputFournisseur);  
			})

			test ('ListBox [ENSEIGNE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.listBoxEnseigne);  
			})

			test ('CheckBox [AFFICHER UNIQUEMENT LES LIGNES MODIFIEES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.checkBoxAffUniqLignesModif);  
			})
					
			test ('DataGrid [LISTE ARTICLE] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageTarifSimulation.dataGridListeArticles,    
					desc        : 'DataGrid [LISTE ARTICLES]',
					verbose		: false,
					column      :   
						[
							'',
							'Famille',
							'Sous famille',
							'** skip **',
							'** skip **',
							'Fournisseurs',
							'CA hebdo.',
							'** skip **',
							'Prix achat actuel',
							'Nouv. prix achat',
							'Var. prix achat',
							'Prix revient théo.',
							'0',
							'** skip **',
							'',
							'',
							'',
							'Prix cession actuel',
							'Marge plateforme actuelle',
							'Nouv. prix cession',
							'Marge plateforme',
							'Var. prix cession',
							'PVC TTC actuel',
							'Marge magasin actuelle',
							'Nouv. PVC TTC',
							'Marge magasin',
							'Var. PVC',
							'Marge magasin €',
							'Nouvelle marge magasin €',
							'Ecart €',
							'Marge globale actuelle',
							'Marge globale',         
						]
				}
				await fonction.dataGridHeaders(oDataGrid);             
			})

		})	//-- Onglet SIMULATION PRIX

	})  //-- End Describe Page

	test.describe ('Page [ALIGNEMENTS]', async () => {    
	
		test ('Page [ALIGNEMENTS] - Click', async () => {
			await menuPage.click('alignements', page);
		})
		
		test ('Label [ERROR] -  Is Not Visible', async () =>{ 
			await fonction.isErrorDisplayed(false, page)
		})  
				 
		test ('Button [ACCORDER]', async () => {
			await fonction.isDisplayed(pageAlignement.buttonAccorder);
		})
		
		test ('DatePicker [ALIGNEMENTS RECUS]', async () => {
			await fonction.isDisplayed(pageAlignement.datePickerAlignementRecus);
		})
		
		test ('InputField [CODE Alignement]', async () => {
			await fonction.isDisplayed(pageAlignement.inputCodeMagasinMagasin);
		})
		
		test ('InputField [MAGASIN Alignement]', async () => {
			await fonction.isDisplayed(pageAlignement.inputCodeArticleMagasin);
		})
	
		test ('InputField [CODE Demandes]', async () => {
			await fonction.isDisplayed(pageAlignement.inputCodeMagasinArticle);
		})
		
		test ('InputField [MAGASIN Demandes]', async () => {
			await fonction.isDisplayed(pageAlignement.inputCodeArticleArticle);
		})
		
		test ('CheckBox [MASQUER MAGASIN SANS ALIGN A TRAITER]', async () => {
			await fonction.isDisplayed(pageAlignement.checkBoxMasquerMagSansAlign);
		})
	
		test ('CheckBox [MASQUER ALIGNEMENTS REPONDUS]', async () => {
			await fonction.isDisplayed(pageAlignement.checkBoxMasquerAlignRepondu);  
		})
		
		test.skip('DataGrid [LISTE MAGASINS] - Check', async () => {
			var dataGrid = await pageAlignement.dataGridListeMagasins.allTextContents();
			for(const header of dataGrid){

				console.log('DataGrid [HEADER] : "' + header + '"');
			}
			var oDataGrid:TypeListOfElements = {
				element     : pageAlignement.dataGridListeMagasins,    
				desc        : 'DataGrid [LISTE MAGASINS]',
				column      :   
					[
						'0',
						'Code',
						'Magasin',
						'Secteur',
						'Région prosol',
						'Nb',
						'Traitées',   
						'Actions',        
					]
			}
			await fonction.dataGridHeaders(oDataGrid);             
		})

		test.skip('DataGrid [LISTE ARTICLES] - Check', async () => {
			var oDataGrid:TypeListOfElements = {
				element     : pageAlignement.dataGridListeArticles,    
				desc        : 'DataGrid [LISTE ARTICLES]',
				column      :   
					[
						'Magasin',
						'Heure',
						'Code',
						'Article',
						'Qualité observée',
						'PvC constaté unité',
						'Concurrent',
						'Vente par',
						'PvC actuel unité',
						'PvC demandé unité',
						'Prix de revient',
						'PvC applicable unité',
						'Réponse',    
						'Actions'   
					]
			}
			await fonction.dataGridHeaders(oDataGrid);            
		})

	})  //-- End Describe Page
	
	test.describe ('Page [GESTION DES MAGASINS]', async () => {    
		
		test ('Page [GESTION DES MAGASINS] - Click', async () => {
			await menuPage.click('gestion', page);
		})
		
		test ('Label [ERROR] -  Is Not Visible', async () =>{ 
			await fonction.isErrorDisplayed(false, page)
		})                       
											
		test ('Button [CREER GROUPE DE MAGASINS]', async () => {
			await fonction.isDisplayed(pageGestion.buttonCreerGroupeMagasin);
		})
		
		test ('Button [ASSOCIER MAGASIN]', async () => {
			await fonction.isDisplayed(pageGestion.buttonAssocierMagasin);
		}) 
		
		test ('InputField [RECHERCHE]', async () => {
			await fonction.isDisplayed(pageGestion.inputSearch);
		})
		
		test ('CheckBox [STRATEGIE]', async () => {
			await fonction.isDisplayed(pageGestion.checkBoxStrategie); 
		})
		
		test ('CheckBox [VILLE]', async () => {
			await fonction.isDisplayed(pageGestion.checkBoxVille);
		})
	
		test ('CheckBox [HABITUDES ALIMENTAIRES]', async () => {
			await fonction.isDisplayed(pageGestion.checkBoxHabitudesAlim);
		})
		
		test ('CheckBox [PROXIMITE GEOGRAPHIQUE]', async () => {
			await fonction.isDisplayed(pageGestion.checkBoxProximiteGeo);
		})
				
		test ('DataGrid [LISTE ARTICLES] - Check', async () => {
			var oDataGrid:TypeListOfElements = 
			{
				element     : pageGestion.dataGridListeArticles,    
				desc        : 'DataGrid [LISTE ARTICLES]',
				column      :   
					[
						'Nom du groupe',
						'Nb magasins',
						'Description',
						'Actions',         
					]
			}
			await fonction.dataGridHeaders(oDataGrid); 
		})

		test ('DataGrid [LISTE DES MAGASINS] - Check', async () => {
			var oDataGrid:TypeListOfElements = {
				element     : pageGestion.dataGridListeMagasins,    
				desc        : 'DataGrid [LISTE DES MAGASINS]',
				column      :   
					[
						'',
						'Code',
						'Abréviation',
						'Raison sociale',
						'Enseigne',
						'Région géographique',
						'Concurrences',
						'Nouveau',
						'Externe',
						'Auto.',
						'Actions',           
					]
			}
			await fonction.dataGridHeaders(oDataGrid); 
		})  

		test.describe ('Popin [CREATION GROUPE DE MAGASIN]', async () => {

			test ('Button [CREER UN GROUPE DE MAGASINS] - Click', async () => {
				await fonction.clickAndWait(pageGestion.buttonCreerGroupeMagasin, page);
			})

			test ('Popin [CREATION GROUPE DE MAGASIN] - Is Visible', async () => {
				await pageGestion.pPopinCreationGroupe.isVisible()
			})
			
			test ('Label [ERROR] -  Is Not Visible', async () =>{ 
				await fonction.isErrorDisplayed(false, page);
			})                           

			test ('Button [ENREGISTRER]', async () => {
				await fonction.isDisplayed(pageGestion.pButtonGroupeEnregistrer);
			})
					
			test ('Button [ANNULER]', async () => {
				await fonction.isDisplayed(pageGestion.pButtonGroupeAnnuler);
			})         
			
			test ('InputField [NOM]', async () => {
				await fonction.isDisplayed(pageGestion.pInputGroupeNom);
			})
			
			test ('InputField [DESCRIPTION]', async () => {
				await fonction.isDisplayed(pageGestion.pInputGroupeDescription);
			})
			
			test ('InputField [TAUX CALCUL PVC THEO]', async () => {
				await fonction.isDisplayed(pageGestion.pInputGroupeTauxCalculPVC);
			})
			
			test ('InputField [MARGE PLATEFORME]', async () => {
				await fonction.isDisplayed(pageGestion.pInputGroupeMargePlateforme);
			})
			
			test ('InputField [FRAIS LIVRAISON]', async () => {
				await fonction.isDisplayed(pageGestion.pInputGroupeFraisLivraison); 
			})
	
			test ('Button [ANNULER] - Click', async () => {
				await fonction.clickElement(pageGestion.pButtonGroupeAnnuler);
			})                
			test ('Popin [CREATION GROUPE DE MAGASIN] - Is Not Visible', async () => {
				await expect(pageGestion.pPopinCreationGroupe).toBeHidden()
			})

		})  // End describe Popin      

	})  //-- End Describe Page

	test.describe ('Page [STRATEGIES ARTICLES]', async () => {    

		test ('Page [STRATEGIES ARTICLES]', async () => {
			await menuPage.click('strategies', page);
		})

		test ('Label [ERROR] -  Is Not Visible', async () =>{ 
			await fonction.isErrorDisplayed(false, page)
		})                               

		test ('Button [ENREGISTRER]', async () => {
			await fonction.isDisplayed(pageStrategies.buttonEnregistrer);
		})
		
		test ('ListBox [GROUPE ARTICLE]', async () => {
			await fonction.isDisplayed(pageStrategies.listBoxGroupeArticle);
		})
	
		test ('ListBox [GROUPE MAGASIN]', async () => {
			await fonction.isDisplayed(pageStrategies.listBoxGroupeMagasins);
		})
		
		test ('DataGrid [LISTE ARTICLES] - Check', async () => {
			var oDataGrid:TypeListOfElements = {
				element     : pageStrategies.dataGridListeArticles,    
				desc        : 'DataGrid [LISTE ARTICLES]',
				column      :   
					[
						'0',
						'Code',
						'Désignation',
						'Vend.',
						'Com.',
						'Nb groupes',
						'Nb magasins',     
					]
			}
			await fonction.dataGridHeaders(oDataGrid);
		})

		test ('DataGrid [LISTE GROUPE MAGASINS] - Check', async () => {
			var oDataGrid:TypeListOfElements = {
				element     : pageStrategies.dataGridListeGroupesMagasins,    
				desc        : 'DataGrid [LISTE GROUPE MAGASIN]',
				column      :   
					[
						'0',
						'Nom du groupe',
						'Nb magasins',
						'Description',
						'Nb articles pour rayon',      
					]
			}
			await fonction.dataGridHeaders(oDataGrid);
		})

	})  //-- End Describe Page
	
	test.describe ('Page [ADMIN]', async () => {    
		var pageName = 'admin';

		test ('Page [ADMIN] - Click', async () => {
			await menuPage.click(pageName, page);
		})

		test ('Label [ERROR] -  Is Not Visible', async () => { 
			await fonction.isErrorDisplayed(false, page)
		}) 

		test ('Onglet [ADMINISTRATION] - Click', async () => {
			await menuPage.clickOnglet(pageName, 'administration', page);
		})

		test ('Onglet [COMMUNICATION UTILISATEURS] - Click', async () => {
			await menuPage.clickOnglet(pageName, 'communicationUtilisateurs', page);
		})

		test ('Onglet [CHANGELOG] - Click', async () => {
			await menuPage.clickOnglet(pageName, 'changelog', page);
		})

		test.describe("Onglet [PARAMETRAGES]", async() => {

			test ('Onglet [PARAMETRAGES] - Click', async () => {
				await menuPage.clickOnglet(pageName, 'parametrages', page);                         
			})   
			
			test ('Button [ENREGISTRER]', async () => {
				await fonction.isDisplayed(pageAdminParametrage.buttonEnregistrer);
			})
	
			test ('DataGrid [PARAMETRAGES] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageAdminParametrage.trHeaderParametrages.locator('th'),    
					desc        : 'DataGrid [PARAMETRAGES]',
					column      :   
						[
							'Code',
							'Désignation',
							'Valeur'     
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
        })
	})  //-- End Describe Page 

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})