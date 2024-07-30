/**
 * 
 * @author JOSIAS SIE
 * @since 2023-11-20
 *  
 */
const xRefTest      = "SOC_LVE_ADD";
const xDescription  = "Création d'un Lieu de Vente";
const xIdTest       =  3129;
const xVersion      = '3.2';
    
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'SOCIETES',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['enseigne', 'designation','typeDeLieu','ville'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page }          from '@playwright/test';

import { Help }                     from '@helpers/helpers.js';
import { TestFunctions }            from '@helpers/functions.js';
import { Log }                      from '@helpers/log.js';
import { EsbFunctions }             from '@helpers/esb.js';

import { MenuSociete }              from '@pom/SOC/menu.page.js'
import { PageLieuxVente }			from '@pom/SOC/lieux-de-vente.page.js';

import { CartoucheInfo, TypeEsb } 	from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;

let pageLieuxVente      : PageLieuxVente;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

fonction.importJdd();

const sEnseigne     = fonction.getInitParam('enseigne','Grand Frais');
var sDesignation    = fonction.getInitParam('designation', ''); 
var sTypeDeLieu     = fonction.getInitParam('typeDeLieu', 'Magasin');
const sVille        = fonction.getInitParam('ville','TA Ville Machin - /L\'ile');
sDesignation        = sDesignation ? sDesignation : 'TA_lieu vente. ' + fonction.getToday('FR');

const sAdresse1     = 'TA Adresse 1 ' + fonction.getToday('FR') + fonction.getBadChars();
const sAdresse2     = 'TA Adresse 2 ' + fonction.getToday('FR') + fonction.getBadChars();
const sCodePostal   = '88888';
const sLatitude     = '45.081378';
const sLongitude    = '1.545757';
const iCodeGie      = Math.floor((fonction.random() * 900) + 100);

var oData = {
    sDesignation    : ''
}

//------------------------------------------------------------------------------------ 

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuSociete(page, fonction);    
    pageLieuxVente      = new PageLieuxVente(page);
    esb                 = new EsbFunctions(fonction);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async({}) => {
	await fonction.close();
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async() => {
        await fonction.connexion(page);
    })

    test('P-dialog [ALERT][ERREUR][PAGE] - Check', async () => {
        await fonction.isErrorDisplayed(false, page); // Pas d'erreur affichée à priori au chargement de la page 
    }) 

    test.describe('Page [LIEUX VENTE]', async () => {    

        let pageMenu ="lieuxVente";

        test("Menu [LIEUX] - Click ", async () => {
            await menu.click(pageMenu, page);
        })

        test('P-dialog [ALER ERREUR][PAGE LIEUX] - Check', async () => {
            await fonction.isErrorDisplayed(false, page); // Pas d'erreur affichée à priori au chargement de la page 
        }) 

        test('Button [CREER UN LIEU DE VENTE] - Click', async () => {
            await fonction.clickElement(pageLieuxVente.buttonCreerLieuVente);
        })

        var sNomPopin = "Création d'un lieu de vente";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test('Popin [CREATION D\'UN LIEU] - Check', async () => {
                await fonction.popinVisible(page, sNomPopin, true); // Pas d'erreur affichée à priori au chargement de la Popin
            })

            test('ListBox [TYPE DE LIEU] ['+sTypeDeLieu+']', async () => {
                var text = await pageLieuxVente.pPcreateListBoxTypeLieu.locator('span').textContent();
                if(text != 'Magasin'){
                    await fonction.clickAndWait(pageLieuxVente.pPcreateListBoxTypeLieu, page);
                    await fonction.clickElement(page.locator('li[aria-label="'+sTypeDeLieu+'"]'));
                }
            })

            test('ListBox [ENSEIGNE] ['+sEnseigne+']', async () => {
                var text = await pageLieuxVente.pPcreateListBoxEnseigne.locator('span').textContent();
                if(text != 'Grand Frais'){
                    await fonction.clickAndWait(pageLieuxVente.pPcreateListBoxEnseigne, page)
                    await fonction.clickElement(page.locator('li[aria-label="'+sEnseigne+'"]'));
                }
            })

            if (sEnseigne === 'Grand Frais') { // Les Enseignes "grand Frais" ont nécessairement un code GIE
                test('ListBox [ENSEIGNE] = "Grand Frais"', async () => {
                    await fonction.sendKeys(pageLieuxVente.pPcreateInputCodeGie, iCodeGie);
                })
            }

            test('Input [LIEU DE VENTE] ['+sDesignation+']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputDesign, sDesignation);
                oData.sDesignation = sDesignation;
            })

            test('ComboBox [CODE][rnd] - Click', async () => {
                await fonction.clickElement(pageLieuxVente.pPcreateInputCode);
                
                var isActive     = await pageLieuxVente.pPcreateComboBoxList.first().isEnabled();
                if(isActive){
                    var iNbChoix = await pageLieuxVente.pPcreateComboBoxList.count();
                    var iCible   = Math.floor(fonction.random() * iNbChoix );  
    
                    var sChoix   = await pageLieuxVente.pPcreateComboBoxList.nth(iCible).textContent();
                    log.set('ComboBox [CODE] : Sélection Elément ' + iCible + ' / ' + iNbChoix + ' = "' + sChoix + '"');
                    await fonction.clickElement(pageLieuxVente.pPcreateComboBoxList.nth(iCible));
                }
            })

            test('CheckBox [OUVERT DIMANCHE][rnd] - Select', async () => {
                await fonction.clickCheckBox(pageLieuxVente.pPcreateCheckBoxOuvDim, 0.5, false);
            })

            test('DatePicker [DATE OUVERTURE] = "Aujourd\'hui"', async () => {
                await fonction.clickElement(pageLieuxVente.pPcreateDatePeackerOuv);
                await fonction.clickElement(pageLieuxVente.pPcreateDateToday);
            })

            test('Input [ADRESSE] ['+sAdresse1+']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputAdresse, sAdresse1);
            })

            test('Input [ADRESSE COMPLEMENT] ['+sAdresse2+']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputAdresseCpt, sAdresse2);
            })

            test('Input [CODE POSTAL] ['+sCodePostal+']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputCodePostal, sCodePostal);
            })
            
            test('Input [VILLE] ['+sVille+']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputVille, sVille);
            })

            if (sEnseigne === 'Grand Frais') {// Si l'enseigne est grand frais, on sélectionne la France
                test('ListBox [PAYS] = "France"', async () => {
                    var text = await pageLieuxVente.pPcreateListBoxPays.locator('span').textContent();              
                    if(text != 'France'){
                        await fonction.clickAndWait(pageLieuxVente.pPcreateListBoxPays, page);
                        await fonction.clickElement(pageLieuxVente.pPcreateListBoxPaysItem);
                    }
                })
            }
            
            test('ListBox [REGION][rnd] - Select', async () => {
                var text = await pageLieuxVente.pPcreateListBoxRegion.locator('span').textContent();              
                if(text == ' '){
                    await fonction.selectRandomListBoxLi(pageLieuxVente.pPcreateListBoxRegion, false, page);
                }
            })

            test('Input [LATITUDE] ['+sLatitude+']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputLatitude, sLatitude);
            })

            test('Input [LONGITUDE] ['+sLongitude+']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputLongitude, sLongitude);
            })
            
            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageLieuxVente.pPcreateBtnEnregistrer, page, 3000);
                
                var present          = await pageLieuxVente.pErrorMessage.isVisible();
                if (present) {
                    var error:any    = await pageLieuxVente.pErrorMessage.textContent();
                    var errorMessage = error.substr(1,6);
                    if(errorMessage == '[9100]'){
                        await fonction.clickElement(pageLieuxVente.pPcreateLinkAnnuler);
                    }
                }
            })
        })

        await fonction.writeData(oData);
    })  //-- End Describe Page

    test('Déconnexion', async() => {
        // Si on est dans le cadre d'un E2E, sauvegarde des données pour le scénario suivant
        await fonction.deconnexion(page);
    })

    test('** CHECK FLUX **', async () => {
        if (sDesignation) {
            var oFlux:TypeEsb = { 
                "FLUX" : [
                    {
                        "NOM_FLUX" : "Diffuser_LieuDeVente",
                    } 
                ],
                "WAIT_BEFORE"      : 3000,               
            }

            await esb.checkFlux(oFlux, page);
        } else {
            log.set('Check Flux : ACTION ANNULEE');
            test.skip();
        }
    })
})  //-- End Describe