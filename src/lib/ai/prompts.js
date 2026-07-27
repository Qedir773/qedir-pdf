export const summarizePrompt = (text) =>
  `Aşağıdakı mətni Azərbaycan dilində 5 aydın və qısa bullet-point şəklində xülasə et. Yalnız bullet-ları qaytar, əlavə şərh yazma:\n\n${text}`;

export const grammarFixPrompt = (text) =>
  `Aşağıdakı Azərbaycan dilindəki mətnin qrammatik, orfoqrafik və durğu işarəsi səhvlərini düzəlt. Mətnin əsl mənasını və üslubunu dəyişmə. Yalnız düzəldilmiş mətni qaytar:\n\n${text}`;

export const translatePrompt = (text, targetLangLabel) =>
  `Aşağıdakı mətni ${targetLangLabel} dilinə tərcümə et. Yalnız tərcüməni qaytar, əlavə şərh yazma:\n\n${text}`;

export const toneRewritePrompt = (text, toneLabel) =>
  `Aşağıdakı mətni "${toneLabel}" üslubunda yenidən yaz, əsas mənanı saxla. Yalnız yenidən yazılmış mətni qaytar:\n\n${text}`;
