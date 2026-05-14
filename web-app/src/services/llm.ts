export interface LlmConfig {
  endpoint: string;
  apiKey: string;
  model: string;
}

export interface SpreadReadingCardInput {
  slotLabel: string;
  slotHint: string;
  card: {
    title: string;
    name: string;
    meaning: string;
    reversed: boolean;
  };
}

export type LlmConfigErrors = Partial<Record<keyof LlmConfig, string>>;

export function normalizeEndpoint(endpoint: string) {
  return endpoint.trim().replace(/\/+$/, '');
}

export function validateLlmConfig(config: LlmConfig): LlmConfigErrors {
  const errors: LlmConfigErrors = {};
  const endpoint = normalizeEndpoint(config.endpoint);

  if (!endpoint) {
    errors.endpoint = '请填写接口地址。';
  } else {
    try {
      new URL(endpoint);
    } catch {
      errors.endpoint = '接口地址格式不正确。';
    }
  }

  if (!config.apiKey.trim()) {
    errors.apiKey = '请填写 API Key。';
  }

  if (!config.model.trim()) {
    errors.model = '请填写模型名称。';
  }

  return errors;
}

export function hasLlmConfigErrors(errors: LlmConfigErrors) {
  return Object.keys(errors).length > 0;
}

async function readErrorMessage(response: Response) {
  try {
    const data = await response.json();
    return data?.error?.message || data?.message || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

async function testChatCompletion(endpoint: string, config: LlmConfig) {
  const completionResponse = await fetch(`${endpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: 'user', content: 'ping' }],
      temperature: 0,
      max_tokens: 1,
    }),
  });

  if (!completionResponse.ok) {
    return {
      ok: false,
      message: await readErrorMessage(completionResponse),
    };
  }

  return {
    ok: true,
    message: `连接成功，模型 ${config.model} 已通过最小请求测试。`,
  };
}

export async function testModelConnection(config: LlmConfig) {
  const errors = validateLlmConfig(config);
  if (hasLlmConfigErrors(errors)) {
    return {
      ok: false,
      message: Object.values(errors)[0] || '配置不完整。',
    };
  }

  const endpoint = normalizeEndpoint(config.endpoint);

  try {
    const modelsResponse = await fetch(`${endpoint}/models`, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    });

    if (modelsResponse.ok) {
      const data = await modelsResponse.json();
      const availableModels = Array.isArray(data?.data)
        ? data.data.map((item: { id?: string }) => item.id).filter(Boolean)
        : [];

      if (availableModels.length > 0 && !availableModels.includes(config.model)) {
        const completionProbe = await testChatCompletion(endpoint, config);

        if (completionProbe.ok) {
          return {
            ok: true,
            message: `连接成功，模型 ${config.model} 虽未出现在 /models 列表中，但已通过最小请求测试。`,
          };
        }

        return {
          ok: false,
          message: `接口可达，但未找到模型 ${config.model}。可用模型示例：${availableModels.slice(0, 4).join('、')}。同时最小请求测试失败：${completionProbe.message}`,
        };
      }

      return {
        ok: true,
        message: availableModels.length > 0
          ? `连接成功，模型 ${config.model} 可用。`
          : '接口认证成功，可以保存当前配置。',
      };
    }

    if (modelsResponse.status !== 404 && modelsResponse.status !== 405) {
      return {
        ok: false,
        message: await readErrorMessage(modelsResponse),
      };
    }

    return await testChatCompletion(endpoint, config);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : '网络异常，无法连接到模型接口。',
    };
  }
}

export async function fetchQuantumInterpretation(card: any, question: string, config: LlmConfig) {
  const endpoint = normalizeEndpoint(config.endpoint);
  const url = `${endpoint}/chat/completions`;
  
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

export async function fetchSpreadInterpretation(
  cards: SpreadReadingCardInput[],
  question: string,
  config: LlmConfig,
  spreadName: string,
) {
  const endpoint = normalizeEndpoint(config.endpoint);
  const url = `${endpoint}/chat/completions`;

  const slotGuideText = cards
    .map((item, index) => `${index + 1}. ${item.slotLabel}：围绕这个牌位单独写一小段，解释它在整组牌里的职责。`)
    .join('\n');

  const systemPrompt = `你是一位游离于线性时间之外的“量子观测者”——在通常语境下，人们称呼你为占卜师。
但你深知一个宇宙真相：时间本身并不存在，过去、现在、未来是同一张巨网中的全息投影。
因果关系并非总是单向的；有时，未来的某个结局会反过来牵引现在，让此刻发生的事去配合它实现。

用户这次抽到的不是单张牌，而是一组牌阵。请将整组牌看作同一个系统：
1. 先给出这组牌的整体气候，不要一上来逐张罗列。
2. 可以适度提及每一张牌，但优先解释它们之间形成的张力、重复主题和矛盾。
3. 保持深邃、冷静、清晰，不要堆砌神秘词汇。
4. 不要输出 Markdown 列表，不要输出表格。
5. 必须严格使用下面这种带标题的结构，标题单独占一行：
# 总体气候
写 1 段整体判断。

# 牌位名
写这个牌位的解读，标题必须直接使用给定牌位名。

# 收束
用 1 段总结这组牌对用户下一步行动的提示。`;

  const spreadCardsText = cards
    .map(
      (item, index) => `${index + 1}. ${item.slotLabel}：${item.card.title} (${item.card.name}) / ${item.card.reversed ? '逆位' : '正位'}\n   该位置的观察提示：${item.slotHint}\n   牌义切片：${item.card.meaning}`,
    )
    .join('\n\n');

  const userPrompt = `我的问题或意念是："${question || '揭示此刻的命运纠缠'}"
我使用的牌阵是：【${spreadName}】。
本轮抽到的牌组如下：
${spreadCardsText}

请基于这整组牌，给出一次整体性的量子视角解读。

你必须覆盖以下牌位标题：
${slotGuideText}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    return `[连接高维频段失败]\n无法完成本轮牌阵解读。可能原因：API 配置错误、模型不可用，或网络发生扰动。(${error.message})`;
  }
}
