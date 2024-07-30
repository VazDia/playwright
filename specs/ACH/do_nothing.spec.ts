/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-01
 * 
 */

//------------------------------------------------------------------------------------

import { test, type Page, expect }  from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';

import { Trigrammes }       from '@conf/automaticiens.conf.json';

import fs                   from 'fs';
import { TypeSearchFile } from '@commun/types';

//------------------------------------------------------------------------------------

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
    console.log('Liste des Automaticiens Référencés : ');
    console.log(Trigrammes);
});

test.afterAll(async () => {
  await fonction.close();
});

//------------------------------------------------------------------------------------

test.describe ('Check Authors' , () => {

    var aFiles = [];

    test('Lecture Répertoires', async () => {
        const oDatas:TypeSearchFile = {
            sPath : 'C:\\pw\\playwright\\specs\\',
            sExtension : '.ts',
            bVerbose : false,
            bRecursive : true,
            aExcludeDirs : []
        }
        aFiles = fonction.readDirectoryContent(oDatas);
    });

    test('Lecture Fichiers', async () => {

        var aTrigrammes  = [[]];

        aFiles.forEach((sFile)=> {

            let file = fs.readFileSync(sFile, "utf8");
            let arr = file.split(/\r?\n/);
            const endForEach = {};

            try{
                arr.forEach((line)=> {
                    if(line.includes("* @author")){
                        //console.log('File : ' + sFile + ' => '+ line);
                        var bAutomaticienTrouve = false;
                        Object.keys(Trigrammes).forEach(key => {
                            if (line.toLowerCase().includes(Trigrammes[key].toLowerCase())) {
                                if (aTrigrammes[key] === undefined) {
                                    aTrigrammes[key] = [sFile];
                                } else {
                                    aTrigrammes[key].push(sFile);
                                }       
                                bAutomaticienTrouve = true;                         
                                //console.log(key + ' -> ' + aTrigrammes[key]);
                            }
                        });

                        if (bAutomaticienTrouve === false){
                            console.log('----> File : ' + sFile + ' Automaticien non Trouvé ! (' + line + ')');
                        }

                        throw endForEach;
                    }
                });
                console.log('====> Absent dans Fichier : ' + sFile);
            } catch (err) {
                if (err !== endForEach) throw err;
            }

        })

        console.log(aTrigrammes);

    });

})