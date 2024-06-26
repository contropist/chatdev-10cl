import cx from 'classnames'
import React, {FC, memo, useEffect, useMemo, useState} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {IoCheckmarkSharp, IoCopyOutline} from 'react-icons/io5'
import {BeatLoader} from 'react-spinners'
import {ChatMessageModel} from '~/types'
import Markdown from '../Markdown'
import ErrorAction from './ErrorAction'
import MessageBubble from './MessageBubble'
import {
  getStore,
  getRealYaml,
  setRealYaml,
  setRealYamlKey,
  setStore, setPendingMessage, isChatMode, setHookedMessage
} from "~services/storage/memory-store";
import {useAtom} from "jotai/index";
import {promptFlowTips} from "~app/state";

const COPY_ICON_CLASS = 'self-top cursor-pointer invisible group-hover:visible mt-[12px] text-primary-text'

interface Props {
  message: ChatMessageModel
  className?: string
}

const ChatMessageCard: FC<Props> = ({message, className}) => {
  const [copied, setCopied] = useState(false)
  const [tips, setTips] = useAtom(promptFlowTips);

  const copyText = useMemo(() => {
    if (message.text) {
      return message.text
    }
    if (message.error) {
      return message.error.message
    }
  }, [message.error, message.text])

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000)
    }
  }, [copied])

  function tipClick(value: string) {
    setHookedMessage(value)
  }

  return (
    <div
      className={cx('group flex gap-3 w-full', message.author === 'user' ? 'flex-row-reverse' : 'flex-row', className)}
    >
      <div className="flex flex-col w-11/12  max-w-fit items-start gap-2">
        <MessageBubble color={message.author === 'user' ? 'primary' : 'flat'}>
          {message.text ? (
            <Markdown type={message.author === 'user' ? 0 : 1}>{message.text}</Markdown>
          ) : (
            !message.error && <BeatLoader size={10} className="leading-tight" color="rgb(var(--primary-text))"/>
          )}
          {!!message.error && <p className="text-red-500">{message.error.message}</p>}
        </MessageBubble>
{/*        {!message.error && !isChatMode() && tips.length > 0 && tips.map((item: string, index: any) => {
          return <div><span key={index} className="agent-action"
                            onClick={() => tipClick(item)}>{index + 1}. {item}</span></div>
        })}*/}
        {!!message.error && <ErrorAction error={message.error}/>}
      </div>
      {!!copyText && (
        <CopyToClipboard text={copyText} onCopy={() => setCopied(true)}>
          {copied ? <IoCheckmarkSharp className={COPY_ICON_CLASS}/> : <IoCopyOutline className={COPY_ICON_CLASS}/>}
        </CopyToClipboard>
      )}
    </div>
  )
}

export default memo(ChatMessageCard)
