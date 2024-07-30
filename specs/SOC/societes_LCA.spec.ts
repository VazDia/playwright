/**
 * 
 * SOCIETES APPLICATION > CONNEXION
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/10/12
 * 
 */
const xRefTest      = "SOC_LCA_CHK";
const xDescription  = "Examine la Liste de Contrôle d'Accès à Sigale SOCIETES";
const xIdTest       =  3125;
const xVersion      = '3.4';

var info = {
    desc        : xDescription,
    appli       : 'SOC',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page, expect }          from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log.js';
import { Credential }                       from '../../conf/environnements/credential.conf.js';

import { AuthentificationNomPage }          from '@pom/COMMUN/authentification_NOM.page.js';

import { MenuSociete }                      from '@pom/SOC/menu.page.js';

//------------------------------------------------------------------------------------

let page                : Page;
let log                 : Log;

let pageObjectAuth      : AuthentificationNomPage;

let menu                : MenuSociete;

const fonction          = new TestFunctions();
const profil            = 'lunettes';
const userCredential    = new Credential(profil);

var profilData          = userCredential.getData();

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();    
    log                 = new Log();

    pageObjectAuth      = new AuthentificationNomPage(page);
    menu                = new MenuSociete(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async({}) => {
	await fonction.close();
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    var injects			=  [
        [false, '', ''],
        [false, 'Foo', 'Bar'],
        [false, profilData.login, ''],
        [false, '', profilData.password],
        [false, "' or '1' = '1", "' or '1' = '1"],
        [false, "' OR 1=1'); //", "' OR 1=1'); //"]
    ]

    test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

    test.describe('Login - Wrong Parameters >', async () => {
		
		injects.forEach(async (data) => {

			var expected	= data[0]
			var login 		= data[1];
			var password 	= data[2];

			test('Login: [ ' + login + ' ] / Pwd: [ ' + password + ' ]', async () => {
                await pageObjectAuth.setJUsername(login, page);
                await pageObjectAuth.setJPassword(password, page);
                await pageObjectAuth.clickConnexionButton(page);
				expect(pageObjectAuth.isErrorDisplayed() == expected);
			})	
		})
	})   

    test.describe('Login - Right Parameters >', async () => {

		var login 		= profilData.login;
		var password	= profilData.password;
		
		test('Login: [ ' + login + ' ] / Pwd: [ ' + password + ' ]', async () => {
			await pageObjectAuth.setJUsername(login, page);
			await pageObjectAuth.setJPassword(password, page);
			await pageObjectAuth.clickConnexionButton(page);					  
		})

        test('ListBox [USER] - Is Visible', async () => {
            await menu.listBoxUser.isVisible();
        })
	})
   
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})