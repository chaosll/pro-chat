import { SendOutlined } from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import { createStyles, cx, useResponsive } from 'antd-style';
import { useContext, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useStore } from '../../store';

import ActionBar from './ActionBar';
import { AutoCompleteTextArea } from './AutoCompleteTextArea';

const useStyles = createStyles(({ css, responsive, token }) => ({
  container: css`
    position: sticky;
    z-index: ${token.zIndexPopupBase};
    bottom: 0;

    padding-top: 12px;
    padding-bottom: 24px;

    background-image: linear-gradient(to top, ${token.colorBgLayout} 88%, transparent 100%);

    ${responsive.mobile} {
      width: 100%;
    }
  `,
  boxShadow: css`
    position: relative;
    border-radius: 8px;
    box-shadow: ${token.boxShadowSecondary};
  `,
  input: css`
    width: 100%;
    border: none;
    outline: none;
    border-radius: 8px;
  `,
  btn: css`
    position: absolute;
    z-index: 10;
    right: 8px;
    bottom: 6px;

    color: ${token.colorTextTertiary};
    &:hover {
      color: ${token.colorTextSecondary};
    }
  `,
  extra: css`
    color: ${token.colorTextTertiary};
  `,
}));

export const ChatInputArea = ({ className }: { className?: string }) => {
  const [sendMessage, isLoading, placeholder, inputAreaProps] = useStore((s) => [
    s.sendMessage,
    !!s.chatLoadingId,
    s.placeholder,
    s.inputAreaProps,
  ]);
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const [message, setMessage] = useState('');
  const isChineseInput = useRef(false);
  const { styles, theme } = useStyles();
  const { mobile } = useResponsive();

  const send = () => {
    sendMessage(message);
    setMessage('');
  };

  const prefixClass = getPrefixCls('pro-chat-input-area');

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 4,
          colorBgContainer: theme.colorBgElevated,
          controlHeightLG: 48,
          colorBorder: 'transparent',
          colorPrimaryHover: 'transparent',
        },
      }}
    >
      <Flexbox gap={8} padding={16} className={cx(styles.container, `${prefixClass}`, className)}>
        <ActionBar className={`${prefixClass}-action-bar`} />
        <Flexbox
          horizontal
          gap={8}
          align={'center'}
          className={cx(styles.boxShadow, `${prefixClass}-text-container`)}
        >
          <AutoCompleteTextArea
            placeholder={placeholder || '请输入内容...'}
            {...inputAreaProps}
            className={cx(styles.input, inputAreaProps?.className, `${prefixClass}-component`)}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            autoSize={{ maxRows: 8 }}
            onCompositionStart={() => {
              isChineseInput.current = true;
            }}
            onCompositionEnd={() => {
              isChineseInput.current = false;
            }}
            onPressEnter={(e) => {
              if (!isLoading && !e.shiftKey && !isChineseInput.current) {
                e.preventDefault();
                send();
              }
            }}
          />
          {mobile ? null : (
            <Button
              loading={isLoading}
              type="text"
              className={styles.btn}
              onClick={() => send()}
              icon={<SendOutlined />}
            />
          )}
        </Flexbox>
      </Flexbox>
    </ConfigProvider>
  );
};

export default ChatInputArea;
