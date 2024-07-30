/**
 * @author Mathis NGUYEN
 * @description Importation ventes d'une journée (Remontée des ventes)
 * @since 2024-06-24
 * 
 */
const xRefTest      = "MAG_VTE_IMP";
const xDescription  = "Flux : Importation ventes d'une journée";
const xIdTest       =  1570;
const xVersion      = '3.2';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : [],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { expect, test, type Page}   from '@playwright/test';
import { JSDOM } from 'jsdom';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { ApiClient }                from '@helpers/api';

import { Credential }               from '@conf/environnements/credential.conf.js';

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { VentesJournee }            from '@pom/MAG/ventes-journee.page';

import { AutoComplete, CartoucheInfo, APIRequestObject } from '@commun/types';
//------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageVentes          : VentesJournee;

const log               = new Log();
const fonction          = new TestFunctions(log);

const profil            = 'lunettes';
const userCredential    = new Credential(profil);
var profilData          = userCredential.getData();

const sUrlEsbProd       = 'http://172.30.24.1:9091/';

//------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------

const sCodeMagasin  = fonction.getInitParam('codeMagasin', '990')
const sRayon        = fonction.getInitParam('rayon', 'PO')
const sDate         = fonction.getInitParam('date', fonction.getToday('US', 0, '-'));

const sDateMin = sDate + 'T00:00:00';
const sDateMax = sDate + 'T' + fonction.getHeure() + ':59';





// ***************  PARAMETRES et FONCTIONS POUR LA REMONTEE DES VENTES ***************

//Without JSDOM
function extractFlowIdsv1(html: string): string[] {
    const pattern = /LIGNE_EnvoyerVentes_Mag\.(\d+\.\d+)/g;
    const matches = html.match(pattern);
    
    if (!matches) {
        return [];
    }
    
    const onlyIds = matches.map(match => {
        const ids = match.replace('LIGNE_EnvoyerVentes_Mag.', '');
        return ids;
    });
    
    return onlyIds
}

//With JSDOM
function extractFlowIdsv2(html: string): any[] {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const table = document.querySelector('table[cellspacing="0"][rules="rows"]');
    const elements = table.querySelectorAll('tr');

    const flowIds = new Set();

    const pattern = /LIGNE_EnvoyerVentes_Mag\.(\d+\.\d+)/;

    elements.forEach((element) => {
        const id = element.id;
        const match = id ? id.match(pattern) : null;
        if (match) {
            flowIds.add(match[1]);
        }
    });

    const result = Array.from(flowIds);
    return result;
}

const aEnvironnement = {
    'integration'   : 'http://magasin.int.sigale.prosol.pri/',
    'integration2'  : 'http://app1.int2.sigale.prosol.pri:9087/',
    'formation'     : 'http://app1.form.sigale.prosol.pri:9087/',
    'fab'           : 'http://app1.fab.sigale.prosol.pri:9087/',
    'preprod'       : 'http://magasin-app1.prep.sigale.prosol.pri:80/'
};

//API Flux
const apiRequestFluxMagasin: APIRequestObject = {
    baseUrl: sUrlEsbProd,
    authMethod: 'No Auth',
};
const apiClientFluxMagasin = new ApiClient(apiRequestFluxMagasin);

//API Ventes
const apiRequestVentesMagasin: APIRequestObject = {
    baseUrl: aEnvironnement[fonction.environnement],
    authMethod: 'No Auth',
};
const apiClientVentesMagasin = new ApiClient(apiRequestVentesMagasin);


let aFlowIds = null;
let xmlResponse = null;
let iTotalMontantTTC:number = 0;
let iNombreVentes:number = 0;


// *************** PARAMETRES et FONCTIONS POUR LA VERIFICATION DE LA REMONTEE DES VENTES ***************

function getDateCalendar(dateString:string) {
    
    const date = new Date(dateString);
    
    const day = date.getDate().toString();
    const monthIndex = date.getMonth();
    const year = date.getFullYear().toString();
    
    const months    = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month     = months[monthIndex];
    
    return [day, month, year];
}

const aGroupes = {
    'BC' : [''],
    'CR' : ['Coupe / Corner', 'Frais LS', 'IT - Coupe / Corner', 'IT - Frais LS'],
    'FL' : ['Fraîche découpe', 'Fruits et légumes'],
    'PO' : ['Marée', 'IT - Négoce', 'IT - Traiteur DM'],
    'TR' : ['Elaborés']
}

const aNomGroupes   = aGroupes[sRayon];

const [sDayFrom, sMonthFrom, sYearFrom] = getDateCalendar(sDateMin);
const [sDayTo, sMonthTo, sYearTo]       = getDateCalendar(sDateMax);

// ***********************************************************************************************************


//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuMagasin(page, fonction);
    pageVentes      = new VentesJournee(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async () => {
    await fonction.close();
});

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {

    test.describe ('Récupération des ventes', async () => {

        var sFlowId:string;

        log.set('Date Début : ' + sDateMin);
        log.set('Date Fin : ' + sDateMax);

        test ('Interrogation ESB', async () => {

            await page.goto(sUrlEsbProd + "execution?filtre=null&dateMin=" + sDateMin + "&dateMax=" + sDateMax + "&derniereLigne=undefined&filtreDescription=" + sCodeMagasin + sRayon + "&flux=EnvoyerVentes_Mag&groupe=Sigale%20-%20Magasin&noaction=true");

            sFlowId = await page.locator('table:nth-child(1) tbody tr[tabindex="1"] td:nth-child(1)').first().textContent();
            log.set('FlowId : ' + sFlowId);

        })

        /*
        test.skip ('Récupérer un flow ID', async () => {
            const params = {
                'filtre'            : 'null',
                'dateMin'           : sDateMin,
                'dateMax'           : sDateMax,
                'derniereLigne'     : 'undefined',
                'filtreDescription' : sCodeMagasin + sRayon,
                'flux'              : 'EnvoyerVentes_Mag',
                'groupe'            : 'Sigale - Magasin',
                'noaction'          : 'true',
            };

            var response = await apiClientFluxMagasin.get("execution", null, params)
            var textResponse = await response.text()
            aFlowIds = extractFlowIdsv2(textResponse)

            console.log("FlowIDs : " + aFlowIds)

            expect(aFlowIds.length).toBeGreaterThan(0);
        })

        test.skip ('Récuperer le XML', async () => {
            const params = {
                'flowid'            : 'EnvoyerVentes_Mag.' + aFlowIds[0],
            };
            var response = await apiClientFluxMagasin.get("infostart", null, params)
            xmlResponse = await response.text()

            expect(xmlResponse).toBeTruthy();

            const dom = new JSDOM(xmlResponse, {
                contentType: "application/xml"
            });
            
            const ventes = dom.window.document.querySelectorAll('vente');
            
            ventes.forEach(vente => {
                const iMontantTTC = parseFloat(vente.querySelector('montant_ttc').textContent);
                iTotalMontantTTC += iMontantTTC;
            });

            iTotalMontantTTC = Number(iTotalMontantTTC.toFixed(2))
            
            console.log('Total Montant TTC : ', iTotalMontantTTC);
        })
        */

        test ('Récuperer le XML', async () => {
            const params = {
                'flowid'            : 'EnvoyerVentes_Mag.' + sFlowId.trim(),
            };
            var response = await apiClientFluxMagasin.get("infostart", null, params)
            xmlResponse = await response.text();

            expect(xmlResponse).toBeTruthy();

            const dom = new JSDOM(xmlResponse, {
                contentType: "application/xml"
            });
            
            const ventes = dom.window.document.querySelectorAll('vente');
            
            ventes.forEach(vente => {
                const iMontantTTC = parseFloat(vente.querySelector('montant_ttc').textContent);
                iTotalMontantTTC += iMontantTTC;
                const iNombreUnite = parseFloat(vente.querySelector('quantite').textContent);
                iNombreVentes += iNombreUnite;
            });

            iTotalMontantTTC = Number(iTotalMontantTTC.toFixed(2))
            
            log.set('Nombre Ventes : ' + iNombreVentes);
            log.set('Total Montant TTC : ' + iTotalMontantTTC + " €");
        })

    })

    test ('Transmission des ventes', async () => {

        const iTimetout:number = 180000;
        test.setTimeout(iTimetout);

        const bodyCredentials = { login: profilData.login, password: profilData.password };
        var jsonResponse = await apiClientVentesMagasin.post(`ws/auth`, null, JSON.stringify(bodyCredentials), null)
//console.log(jsonResponse);

        const jwtToken = jsonResponse.headers.get('authorization').split(' ')[1];
        expect(jwtToken).toBeDefined();
//console.log(jwtToken);

        const body = xmlResponse;

//console.log(body);        

        const headerOptions = {
            'Authorization' :  `Bearer ${jwtToken}`,
            'Content-Type' : 'application/xml'
        }

//console.log(headerOptions);

        await apiClientVentesMagasin.post(`ws/magasins/${sCodeMagasin}${sRayon}/ventes`, headerOptions, body, null)
    })

    test.describe ('Vérification des ventes', async () => {

        test ('Ouverture URL', async({context}) => {
            await context.clearCookies();
            await fonction.openUrl(page);
        });
    
        test ('Connexion', async () => {
            await fonction.connexion(page);
        });
    
        test.describe('Page [ACCUEIL]', async () => {
    
            test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
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
    
            test ('Page [VENTES] - Click', async () => {
                await menu.click(sNomPage, page);
            })    
    
            test ('InputField [AUTOCOMPLETE][VILLE] = "' + sCodeMagasin + '"', async () =>{
                //await fonction.sendKeys(menu.inputVille, '') //overwrite old value
                var oData:AutoComplete = {
                    libelle         :'VILLE',
                    inputLocator    : menu.inputVille,
                    inputValue      : sCodeMagasin,
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                    clear           : true
                };
                await fonction.autoComplete(oData);
            })
    
            test.describe('Onglet [ANALYSE DES VENTES]', async () => {
       
                test ('Label [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);
                })

                test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
                    await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                        if(isVisible){
                            await menu.removeArlerteMessage();
                        }else{
                            log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                            test.skip();
                        }
                    })
                })

                test ('ListBox  [GROUPE ARTICLE] - Click', async() => {
                    await fonction.clickElement(pageVentes.listBoxGrpArticle); 
                })

                aNomGroupes.forEach((sNomGroupe) => {
                    test ('CheckBox [GROUPE ARTICLE] ["' + sNomGroupe + '"] - Click', async() => {                      
                        if (await pageVentes.checkBoxChoix.filter({ hasText: sNomGroupe }).isVisible()) {    
                            await fonction.clickElement(pageVentes.checkBoxChoix.filter({ hasText: sNomGroupe }));
                            log.set('Groupe Article : ' + sNomGroupe + ' Sélectionné');
                        } else {
                            log.set('Groupe Article : ' + sNomGroupe + ' Ignoré');
                        }
                    })
                });
    
                test ('ListBox  [GROUPE ARTICLE] - Close', async() => {
                    await fonction.clickElement(pageVentes.pictoCloseSelect);                  
                })
    
                test ('Date Picker [FROM] = "' + sYearFrom + "-" + sMonthFrom + "-" +sDayFrom + '"', async () => {         
                    await fonction.clickElement(pageVentes.datePickerVentesFromPicto);
                    await fonction.selectDateCalendar(page, sYearFrom, sMonthFrom, sDayFrom);
                });
    
                test ('Date Picker [TO] = "' + sYearTo + "-" + sMonthTo + "-" +sDayTo + '"', async () => {         
                    await fonction.clickElement(pageVentes.datePickerVentesToPicto);
                    await fonction.selectDateCalendar(page, sYearTo, sMonthTo, sDayTo);
                });
                
                test ('RadioButton [RECHERCHER] - Click', async() => {
                    await fonction.clickAndWait(pageVentes.buttonRechecher, page);
                })
        
                
                test ('Label [Montant TTC total des ventes] > 0 €', async() =>{
        
                    await pageVentes.labelTotalDesVentes.waitFor({state:'visible'});

                    let now = new Date();
                    let firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    let iNumOfDay = firstDayPrevMonth.getDay();     // The getDay() method returns the day of the week (from 0 to 6) of a date.
        
                    if (iNumOfDay > 0) {
                        const sTexte = await pageVentes.labelTotalDesVentes.textContent();
                        const aBouts = sTexte.split(' : ');
                        const iMontant = Number(aBouts[1].replace(/,/g, '.').replace(/[^0-9.-]+/g,""));

                        log.set('Montant affiché : ' + iMontant.toString() + " €");

                        const sQuantites = await pageVentes.labelQuantitesVendues.textContent();
                        const aQuantites = sQuantites.split(' : ');
                        const iQuantite = Number(aQuantites[1].replace(/,/g, '.').replace(/[^0-9.-]+/g,""));

                        log.set('Quantités vendues : ' + iQuantite.toString() + " Unités");

                        expect.soft(iMontant).toEqual(iTotalMontantTTC);
                        expect.soft(iQuantite).toEqual(iNombreVentes);
    
                    } else {
                        log.set('Date choisie tombant un dimanche... Risque d\'absence de valeurs');
                    }
        
                })
    
            }); // end describe
    
        }); // end describe
    
        test ('Déconnexion', async () => {
            await fonction.deconnexion(page);
        });

    })

})