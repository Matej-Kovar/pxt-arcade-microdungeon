 
# Micro Dungeon

Micro Dungeon je hrou žánru dungeon-crawler, ve které je cílem projít náhodně vygenerovaný dungeon. V tom se vám snaží zabranit nepřátele (zombící), kteří jsou s každým podlaží silnější. Po dungeon jsou rozházené pozůstatky dobrodruhů, kteří  se pokusili projít dungeonem před vámi. Jejich vybavení vám může značně pomoct. Není třeba se bát vstoupit!

Hru můžeme spustit [zde](https://matej-kovar.github.io/pxt-arcade-microdungeon/)

## Generace dungeonu

* z makecode assets se načtou chunky, ze kterých se dungeon skládá
* otáčením se získají všechny možné verze stejného chunku
* vygeneruje se přímá cesta s náhodnými odbočkami od startu k cíli, která musí být vždy průchozí
* pomocí algoritmu [wave function collapse](https://github.com/mxgmn/WaveFunctionCollapse/blob/master/README.md) se vyplní dungeon tak, aby na sebe chunky navazovaly.

## Jak hrát
* Pohyb: pomocí wsad, šipek, nebo joystiku
* Útok: pokud další pozice hráče byla schodná s pozicí nepřítele, je nepřítelovy ubrán počet životů schodný útočnou sílou hráče mínus obráná schopnost protivníka. Pokud by naopak protivníkova další pozice byla ta hráčova, ubere životy hráči.
