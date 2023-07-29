package top.flapypan.blog.common

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import kotlin.properties.ReadOnlyProperty
import kotlin.reflect.KProperty

/**
 * slf4j 日志对象获取委托类
 */
class LoggerDelegate : ReadOnlyProperty<Any?, Logger> {

    companion object {
        /**
         * 创建 logger 对象
         */
        @JvmStatic
        private fun <T> createLogger(clazz: Class<T>) = LoggerFactory.getLogger(clazz)
    }

    private var logger: Logger? = null

    /**
     * 获取单例 logger
     */
    override operator fun getValue(thisRef: Any?, property: KProperty<*>): Logger {
        if (logger == null) {
            logger = createLogger(thisRef!!.javaClass)
        }
        return logger!!
    }
}
