import { Animal } from "./animal.js";
import { Recinto } from "./recinto.js";

class RecintosZoo {

    constructor() {
        this.animais = [
            new Animal('LEAO', 3, ['SAVANA'], true),
            new Animal('LEOPARDO', 2, ['SAVANA'], true),
            new Animal('CROCODILO', 3, ['RIO'], true),
            new Animal('MACACO', 1, ['SAVANA', 'FLORESTA'], false),
            new Animal('GAZELA', 2, ['SAVANA'], false),
            new Animal('HIPOPOTAMO', 4, ['SAVANA', 'RIO'], false),
        ];

        this.recintos = [
            new Recinto(1, ['SAVANA'], 10, [this.animais[3], this.animais[3], this.animais[3]]),
            new Recinto(2, ['FLORESTA'], 5, []),
            new Recinto(3, ['SAVANA', 'RIO'], 7, [this.animais[4]]),
            new Recinto(4, ['RIO'], 8, []),
            new Recinto(5, ['SAVANA'], 9, [this.animais[0]]),
        ];

        this.stringResultadoTemplate = 'Recinto x (espaço livre: y total: z)';
    }

    analisaRecintos(animal, quantidade) {
        animal = animal.toUpperCase();

        const validacao = this.validarEntrada(animal, quantidade);
        if(Object.keys(validacao).length) return validacao;

        const registroAnimal = this.obterAnimal(animal);

        let recintosPossiveis = this.recintos;
        recintosPossiveis = this.filtrarRecintosPorBioma(recintosPossiveis, registroAnimal);
        recintosPossiveis = this.filtrarRecintosPorTamanho(recintosPossiveis, registroAnimal, quantidade);
        recintosPossiveis = this.filtrarRecintosPorPeculiaridadesDoLote(
            recintosPossiveis,
            registroAnimal,
            quantidade
        );
        recintosPossiveis = this.filtrarRecintosPorPeculiaridadesDosAnimaisPresentes(
            recintosPossiveis,
            registroAnimal
        );

        if(recintosPossiveis.length) {
            return {
                recintosViaveis: recintosPossiveis.map(recinto => {
                    for(let i = 0; i < quantidade; i++)
                        recinto.adicionarAnimal(registroAnimal);

                    return this.stringResultadoTemplate
                    .replace('x', recinto.numero)
                    .replace('y', recinto.calcularEspacoLivre())
                    .replace('z', recinto.tamanho);
                })
            };
        }

        return {
            erro: "Não há recinto viável"
        };
    }

    validarEntrada(animal, quantidade) {
        const validacao = {};

        if(!this.animais.map(animal => animal.especie).includes(animal))
            validacao.erro = "Animal inválido";
        if(!quantidade || quantidade < 0 || !parseInt(quantidade))
            validacao.erro = "Quantidade inválida";

        return validacao;
    }

    obterAnimal(especie) {
        let resultado;

        this.animais.forEach(animal => {
            if(animal.especie == especie) resultado = animal;
        });

        return resultado;
    }

    filtrarRecintosPorBioma(recintos, animal) {
        const biomas = animal.biomas;

        recintos = recintos.filter(recinto => {
            let resultado = false;

            recinto.biomas.forEach(bioma => {
                if(biomas.includes(bioma)) resultado = true;
            });

            return resultado;
        });

        return recintos;
    }

    filtrarRecintosPorTamanho(recintos, animal, quantidade) {
        const espacoOcupadoNovoLote = animal.tamanho * quantidade;
        let espacoJaOcupado;

        recintos = recintos.filter(recinto => {
            const filtroMesmaEspecie = recinto.animais.filter(animalRecinto => {
                return animalRecinto.especie == animal.especie
            });

            espacoJaOcupado = recinto.animais.reduce((x, animal) => x + animal.tamanho, 0);
            if(!(filtroMesmaEspecie == recinto.animais)) espacoJaOcupado++;

            return recinto.tamanho >= espacoJaOcupado + espacoOcupadoNovoLote;
        });

        return recintos;
    }

    filtrarRecintosPorPeculiaridadesDoLote(recintos, animal, quantidade) {
        recintos = recintos.filter(recinto => {
            const filtroMesmaEspecie = recinto.animais.filter(animalRecinto => {
                return animalRecinto.especie == animal.especie
            });

            if(animal.carnivoro) {
                return (filtroMesmaEspecie == recinto.animais) || !recinto.animais.length;
            }
            if(animal.especie == "HIPOPOTAMO") {
                if(!(recinto.biomas.includes("SAVANA") && recinto.biomas.includes("RIO"))) {
                    return filtroMesmaEspecie == recinto.animais;
                }
            }
            if(animal.especie == "MACACO") {
                return (recinto.animais.length || quantidade != 1);
            }

            return true;
        });

        return recintos;
    }

    filtrarRecintosPorPeculiaridadesDosAnimaisPresentes(recintos, animal) {
        recintos = recintos.filter(recinto => {
            const filtroCarnivoro = recinto.animais.filter(animalRecinto => {
                return animalRecinto.carnivoro;
            });

            const filtroHipopotamo = recinto.animais.filter(animalRecinto => {
                return animalRecinto.especie == "HIPOPOTAMO";
            });

            if(filtroCarnivoro.length) {
                return animal.especie == filtroCarnivoro[0].especie;
            }
            if(filtroHipopotamo.length) {
                if(!(recinto.biomas.includes("SAVANA") && recinto.biomas.includes("RIO"))) {
                    return animal.especie == "HIPOPOTAMO";
                }
            }

            return true;
        });

        return recintos;
    }
}

export { RecintosZoo as RecintosZoo };