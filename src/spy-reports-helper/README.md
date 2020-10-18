# Spy Reports Helper
Dodatek do [MirkOgame](https://mirkogame.pl) wyświetlający informacje o ostatnich raportach szpiegowskich w widoku galaktyki. Raporty pobierane są z wiadomości przychodzących.

W widoku galaktyki dodana jest kolumna o nazwie `Ostatni skan` w której wyświetlane będą informacje o ostatnim skanowaniu użytkownika.

Pozostałe dodatki oraz informację jak zainstalować dodatek można znaleźć [tutaj](../../README.md).

 ### Jak to działa?
 Dodatek pobiera rapotry z wiadomości przychodzących i zapisuje je do local storage.
 
 Pierwsze uruchomienie dodatku:
 1. Dodaj dodatek do przeglądarki. 
 2. Otwórz stronę `Wiadomości` i zakładkę `Raport szpiegowski`.
 3. Przełącz strony w kolejności **od tyłu - KOLEJNOŚĆ MA ZNACZENIE** (np. strony w kolejności: 3, 2, 1)
 4. Otwórz widok galaktyki i najedź kursorem na informację w kolumnie `Ostatni skan` 
 
 ### Znane problemy
 - Jeśli wyświetlisz wiadomość ze starym raportem (np. stronę 2 w zakładce `Raport szpiegowski`) to ostatnie raporty mogą być nadpisane.
   - Przykład: skanowałeś gracza `[1:2:3] Mirek` wczoraj oraz dzisiaj. Dodatek ma w pamięci ostatni raport (ten z dzisiaj), ale jeśli przełączysz stronę wiadomości tak, aby na jednej stronie wyświetlony był tylko wczorajszy raport wywiadu to nadpisze on ten dzisiejszy, znajdujący się w pamięci dodatku i w widoku galaktyki będzie wyświetlany wczorajszy raport.
