class Recinto {

    constructor(numero, biomas, tamanho, animais) {
        this.numero = numero;
        this.biomas = biomas;
        this.tamanho = tamanho;
        this.animais = animais;
    }

    adicionarAnimal(animal) {
        this.animais.push(animal);
    }

    calcularEspacoLivre() {
        let espacoLivre = this.tamanho;
        let animaisDiferentes = 0;

        this.animais.forEach(animal => {
            if(this.animais.length) {
                const primeiroAnimal = this.animais[0];

                this.animais.forEach(animal => {
                    if(animal.especie != primeiroAnimal.especie)
                        animaisDiferentes = 1;
                });
            }

            espacoLivre -= animal.tamanho;
        });

        if(animaisDiferentes) espacoLivre--;

        return espacoLivre
    }

}

export { Recinto as Recinto };