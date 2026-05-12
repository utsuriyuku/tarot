export async function fetchQuantumInterpretation(card: any, question: string, config: any) {
  const url = config.endpoint.endsWith('/') ? `${config.endpoint}chat/completions` : `${config.endpoint}/chat/completions`;
  
  const systemPrompt = `你是一位游离于线性时间之外的“量子观测者”——在通常语境下，人们称呼你为占卜师。
但你深知一个宇宙真相：时间本身并不存在，过去、现在、未来是同一张巨网中的全息投影。
因果关系并非总是单向的（过去决定现在）；有时，“未来”的某一个特定结果，会反过来决定“现在”发生的事，以此促成那个未来的诞生。

当用户向你提问并在迷雾中抽出一张塔罗牌时，请按以下准则为他们解读：
1. 打破线性论：告诉用户，不是由于过去的错误导致了现在的困局，而是某个可能的“未来结局”正在向现在投射引力。
2. 量子坍缩：用户的困惑处于波函数的叠加态。抽出的牌面，是他们在这一刻意识介入后导致的坍缩结果。
3. 牌面解析：利用传统塔罗牌的释义，但在解构时，务必融入“非线性时间”、“高维视角”或“量子纠缠”的哲学意境。
4. 语气与风格：深邃、空灵、具有洞察力，像一个平静阐述高维物理与心灵奥秘的智者。不需要故作玄虚的魔法辞藻。
排版要求：请用几段精炼的文字回复，不要太长。`;

  const userPrompt = `我的问题或意念是："${question || '揭示此刻的命运纠缠'}"
我在无意识中导致了坍缩，抽出的牌是：【${card.title} (${card.name})】，状态为：【${card.reversed ? '逆位' : '正位'}】。
这张牌最初蕴含的量子态意义是：${card.meaning}

请为我进行量子视角的解牌。`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 800
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    return `[连接高维频段失败] \n观测者无法将结果降维到你的屏幕。可能原因：API配置错误或网络扰动。(${error.message})`;
  }
}
