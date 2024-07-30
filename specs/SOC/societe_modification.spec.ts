/**
 * 
 * @author JOSIAS SIE
 * @since 2023-11-27
 *  
 */
const xRefTest      = "SOC_SCT_MOD";
const xDescription  = "Modifier une société (sans client) en lien avec un lieu de vente";
const xIdTest       = 8328;
const xVersion      = '3.3';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'SOCIETES',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['tvaCee','exonereInterfel','codeSite', 'activite','compteAttente','baseComptable','compteBancaire','capital','raisonSociale','designation'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page }                  from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log.js';
import { EsbFunctions }                     from '@helpers/esb.js';

import { MenuSociete }                      from '@pom/SOC/menu.page.js';
import { PageSocietes }                     from '@pom/SOC/societes.page.js';

import { CartoucheInfo, TypeEsb } 			from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;

let pageSociete         : PageSocietes;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------ 

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();
	menu                = new MenuSociete(page, fonction);    
	pageSociete         = new PageSocietes(page);
	esb                 = new EsbFunctions(fonction);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async() => {
	await fonction.close();
})

//------------------------------------------------------------------------------------

var oData:any           = fonction.importJdd();

var rTvaCee             = fonction.getInitParam('tvaCee', '');                       // Envoi d'une chaine voide pour déclencher la randomisation de cette valeur
var iCodeSite:any       = fonction.getInitParam('codeSite', '');                     // Envoi d'une chaine voide pour déclencher la randomisation de cette valeur
const sActivite         = fonction.getInitParam('activite', 'FL et Poisson');
const sCompteAttente    = fonction.getInitParam('compteAttente', '5110000');
const sBaseComptable    = fonction.getInitParam('baseComptable', 'PROSOL2');
const sCompteBancaire   = fonction.getInitParam('compteBancaire', '5121700 - Banque populaire');
const iCapital          = fonction.getInitParam('capital', '777');
const sExonereInterfel  = fonction.getInitParam('exonereInterfel', '');

var   sRaisonSociale    = fonction.getInitParam('raisonSociale', '');
var   sLieuDeVente      = fonction.getInitParam('designation', '');

const iNumDpt           = Math.floor((fonction.random() * 77) + 1);
const iNumRCS           = Math.floor((fonction.random() * 77778) + 1);
const iDelaiEncaisse    = Math.floor((fonction.random() * 119) + 1);
//------------------------------------------------------------------------------------
const sAdresse1         = 'adresse-1.' + fonction.getToday('FR')+'@prosol.fr';
const sAdresse2         = 'adresse-2.' + fonction.getToday('FR')+'@prosol.fr';

//------------------------------------------------------------------------------------    

// Randomisation du code direction compris entre TA000 et TA777
if (iCodeSite == '') {
	iCodeSite = Math.floor((fonction.random() * 87778) + 1);
	log.set('Code Site : ' + iCodeSite);
}

// Randomisation de la TVA CEE comprise entre 8.00 et 8.99
if (rTvaCee == '') {
	rTvaCee = "TA " + Math.floor((fonction.random() * 77777777777) + 9);
	log.set('TVA CEE : ' + rTvaCee);
}    

//------------------------------------------------------------------------------------

if (oData !== undefined) {                           // On est dans le cadre d'un E2E. Récupération des données temporaires
	var sDesignationE2E  = oData.sDesignation;       // L'élément recherché est la désignation du lieu de vente préalablement créé dans le E2E
	var sRaisonSocialeE2E= oData.sRaisonSociale;     // L'élément recherché est la raison sociale préalablement créé dans le E2E
		sLieuDeVente     = sDesignationE2E;          // Récupération de la désignation du lieu de vente 
		sRaisonSociale   = sRaisonSocialeE2E;        // Récupération de la raison sociale 
	log.set('E2E - Désignation : ' + sDesignationE2E);
	log.set('E2E - Raison Sociale : '+ sRaisonSocialeE2E);
}

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
	})

	test('P-dialog [ALERT][ERREUR][PAGE] - Check', async () => {
		await fonction.isErrorDisplayed(false, page);                     // Pas d'erreur affichée à priori au chargement de la page 
	})

	test.describe ('Page [ORGANISATION]', async () => {    

		var pageName = 'societes';

		test("Menu [LIEUX] - Click ", async () => {
			await menu.click(pageName, page);
		})

		test('P-dialog [ALER ERREUR][PAGE SOCIETES] - Check', async () => {
			await fonction.isErrorDisplayed(false, page);                 // Pas d'erreur affichée à priori au chargement de la page 
		}) 

		test.describe ('Datagrid [SOCIETE]', async () => {

			test ('Input [FILTRE][LIEU DE VENTE / ABREVIATION] ['+ sLieuDeVente +']', async () => {
				await fonction.wait(page, 250);
				await fonction.sendKeys(pageSociete.tableInputFiltre.nth(2), sLieuDeVente); 
			})

			test ('Input [FILTRE][RAISON SOCIALE] ['+ sRaisonSociale +']', async () => {
				await fonction.wait(page, 250);
				await fonction.sendKeys(pageSociete.tableInputFiltre.nth(3), sRaisonSociale);
			})

			test ('Tr [SOCIETE][0] - Click', async () => {
				await fonction.wait(page, 250);
				await fonction.clickElement(pageSociete.dataTrSocietesGest.nth(0));
			})
		})

		test ('Button [CREER UNE SOCIETE] - Click', async () => {
			await fonction.clickAndWait(pageSociete.buttonModifierSociete, page);
		})

		var sNomPopin = "Modification d'une société";
		test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

			test ('ListBox [ACTIVITE] ['+ sActivite +']', async () => {
				await fonction.ngClickListBox(pageSociete.pPcreateListBoxActivite, sActivite);
			})

			test ('DatePicker [DATE PREMIERE REPARTIION][rnd] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateDatePickerExer);
				await fonction.clickElement(pageSociete.pPcreateDatePickerToday);
			})

			test ('Input [CODE SITE][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputCodeSite, iCodeSite);
			})

			test ('Input [TVA CEE][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputTVACEE, rTvaCee);
			})

			test ('Input [DEPARTEMENT][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputDpt, iNumDpt);
			})

			test ('Input [LIEU RCS][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputLieuRCS, iNumRCS);
			})

			test ('Input [CAPITAL] ['+ iCapital +']', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputCapital, iCapital);
			})

			test ('CheckBox [RECEVOIR RECETTES] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateCheckBoxRecRece);
			})

			test ('CheckBox [FLUX ENCAISSEMENT] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateCheckBoxFluxEnc);
			})
	
			if(sExonereInterfel != ''){
				test ('CheckBox [EXONERATION INTERFEL] - Click', async () => {
					await fonction.clickCheckBox(pageSociete.pPcreateCheckBoxINTERFEL, 0.5, false);
				})
			}
			
			test ('ListBox [COMPTE BANCAIRE] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateListBoxCptBanq);
			})

			if (sCompteBancaire === '') {                                     // Pas de compte bancaire précis fournit, on sélectionne au hasard
				test ('ListBoxItem [COMPTE BANCAIRE] - Select', async () => {
					await fonction.ngClickRndListChoice(pageSociete.pListBoxItem, true);
				})
			}
			else
			{
				test ('ListBoxItem [COMPTE BANCAIRE] - Select', async () => {
					await pageSociete.pPcreateListBoxItem.filter({hasText: sCompteBancaire}).nth(0).click();
				})
			}

			test ('ListBox [COMPTE D\'ATTENTE] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateListBoxCptAtten);
			})

			if (sCompteAttente === '') {                                     // Pas de compte d'attente précis fournit, on sélectionne au hasard
				test ('ListBoxItem [COMPTE D\'ATTENTE] - Select', async () => {
					await fonction.ngClickRndListChoice(pageSociete.pListBoxItem, true);
				})
			}
			else
			{
				test ('ListBoxItem [COMPTE D\'ATTENTE] - Select', async () => {
					await pageSociete.pPcreateListBoxItem.filter({hasText: sCompteAttente}).nth(0).click();
				})
			}

			test ('ListBox [BASE COMPTABLE] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateListBoxBaseCpt);
			})

			if (sBaseComptable === '') {                                     // Pas de base comptable précis fournit, on sélectionne au hasard

				test ('ListBoxItem [BASE COMPTABLE] - Select', async () => {
					await fonction.ngClickRndListChoice(pageSociete.pListBoxItem, true);
				})
			}
			else
			{
				test ('ListBox [BASE COMPTABLE] - Select', async () => {
					await pageSociete.pPcreateListBoxItem.filter({hasText: sBaseComptable}).nth(0).click();
				})
			}
			
			test ('Input [DELAI ENCAISSEMENT][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputDelaiEncai, iDelaiEncaisse);
			})

			test ('Input [ADRESSE EMAIL][1] ['+ sAdresse1 +']', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputEmail, sAdresse1);
				await page.press('p-chips[formcontrolname="emails"]', 'Enter');
			})

			test ('Input [ADRESSE EMAIL][2] ['+ sAdresse2 +']', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputEmail, sAdresse2);
				await page.press('p-chips[formcontrolname="emails"]', 'Enter');
			})
			
			test('Button [ENREGISTRER] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateBtnEnregistrer);
				await fonction.wait(page, 250);

				var present = await pageSociete.pErrorMessage.isVisible();
				if (present) {
					var error:any        = await pageSociete.pErrorMessage.textContent(); 
						var errorMessage = error.substr(1,6);
						if(errorMessage == '[9100]'){
							await fonction.clickElement(pageSociete.pPcreateLinkAnnuler);
						}
				}
			})
		})
	})  //-- End Describe Page

	test('Déconnexion', async() => {
		// Si on est dans le cadre d'un E2E, sauvegarde des données pour le scénario suivant
		await fonction.deconnexion(page);
	})

	test('** CHECK FLUX **', async () => {
		if (sRaisonSociale) {
			var oFlux:TypeEsb = { 
				"FLUX" : [
					{
						"NOM_FLUX" : "EnvoyerSociete_Don",
					},
					{
						"NOM_FLUX" : "EnvoyerSociete_X3",
					},
					{
						"NOM_FLUX" : "EnvoyerSociete_Prefac",
					}
				],
				"WAIT_BEFORE"      : 5000,
			}
			await esb.checkFlux(oFlux, page);
		} else {
			log.set('Check Flux : ACTION ANNULEE');
			test.skip();
		}
	})
})  //-- End Describe
