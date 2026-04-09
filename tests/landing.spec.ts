import { test, expect } from '@playwright/test';

test.describe('Landing Page Dieta Keto 2026', () => {
  
  test('Layout responsivo (Móvil no genera scroll horizontal)', async ({ page }) => {
    await page.goto('/');
    
    // 1. Verificamos que cargó bien el esqueleto principal
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // 2. Evaluamos que no existan scrolls horizontales inesperados
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    
    expect(hasHorizontalScroll).toBeFalsy();
  });

  test('Componente TopHeaderTimer cuenta hacia atrás correctamente', async ({ page }) => {
    await page.goto('/');
    
    // Localizamos el texto exacto con regex de contador 05:23:29
    const clockRegex = /\d{2}:\d{2}:\d{2}/;
    
    const timeElement = page.locator('text=' + clockRegex).first();
    await expect(timeElement).toBeVisible();
    
    const initialText = await timeElement.innerText();
    
    // Esperamos 2 segundos en el navegador
    await page.waitForTimeout(2000);
    
    const newText = await timeElement.innerText();
    
    // Validamos que el contador bajó, el texto no debería ser igual al inicial
    expect(newText).not.toBe(initialText);
  });

  test('Defensa contra el Bfcache: Botón no debe quedar atascado en "Procesando"', async ({ page }) => {
    await page.goto('/');

    const ctaButton = page.getByRole('button', { name: /SÍ, QUIERO EMPEZAR/i }).first();
    await expect(ctaButton).toBeVisible();

    // Damos click al CTA, esto deberia cambiar el button interno a "Procesando..."
    await ctaButton.click();
    
    // Comprobamos la vista de "Loading..."
    const loadingState = page.getByText('Procesando...');
    await expect(loadingState.first()).toBeVisible();

    // Simulamos que el usuario dió Back desde Stripe o se traicionó el caché
    await page.evaluate(() => {
        window.dispatchEvent(new Event('pageshow'));
        document.dispatchEvent(new Event('visibilitychange'));
    });

    // Validamos que nuestro useEffect de limpieza mató el "Procesando..." 
    // y el botón está listo para otra compra.
    await expect(loadingState).toHaveCount(0);
    await expect(ctaButton).toBeVisible();
  });

});
